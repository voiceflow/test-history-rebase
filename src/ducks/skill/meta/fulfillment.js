import update from 'immutability-helper';
import { createSelector } from 'reselect';
import { debounce } from 'throttle-debounce';

import client from '@/client';
import * as Creator from '@/ducks/creator';
import { activePlatformSelector } from '@/ducks/skill/skill/selectors';
import { createAction } from '@/ducks/utils';

import { activeSkillIDSelector } from '../skill';
import { skillMetaSelector } from './meta';

const FULFILLMENT_AUTOSAVE_DEBOUNCE_TIMEOUT = 500;

export const SET_SKILL_FULFILLMENT = 'SKILL:META:FULFILLMENT:SET';

// REDUCERS

export const setFulfillmentReducer = (state, { payload = {} }) => payload;

function fulfillmentReducer(state = {}, action) {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (action.type) {
    case SET_SKILL_FULFILLMENT:
      return setFulfillmentReducer(state, action);
    default:
      return state;
  }
}

export default fulfillmentReducer;

// SELECTORS

export const fulfillmentSelector = createSelector(skillMetaSelector, ({ fulfillment }) => (intentID) => fulfillment?.[intentID]);

// ACTIONS

export const updateFulfillment = (fulfillment = {}) => (dispatch, getState) => {
  const skillID = activeSkillIDSelector(getState());

  debounce(FULFILLMENT_AUTOSAVE_DEBOUNCE_TIMEOUT, client.skill.update(skillID, { fulfillment }));
  dispatch(createAction(SET_SKILL_FULFILLMENT, fulfillment));
};

export const addFulfillment = (intentID) => (dispatch, getState) => {
  const { fulfillment } = skillMetaSelector(getState());

  dispatch(updateFulfillment(update(fulfillment, { [intentID]: { $set: { slot_config: {} } } })));
};

export const deleteFulfillment = (intentID) => (dispatch, getState) => {
  const { fulfillment } = skillMetaSelector(getState());

  dispatch(updateFulfillment(update(fulfillment, { $unset: [intentID] })));
};

export const toggleFulfillment = (intentID) => (dispatch, getState) => {
  if (intentID) {
    const fulfillment = fulfillmentSelector(getState())(intentID);
    if (fulfillment) {
      dispatch(deleteFulfillment(intentID));
    } else {
      dispatch(addFulfillment(intentID));
    }
  }
};

export const getIntentID = (nodeID) => (_, getState) => {
  const state = getState();

  const nodeData = Creator.dataByNodeIDSelector(state)(nodeID);
  const platform = activePlatformSelector(state);

  return nodeData?.[platform]?.intent;
};

export const removeIntentFulfillment = (nodeID) => (dispatch, getState) => {
  const intentID = dispatch(getIntentID(nodeID));

  if (intentID) {
    const fulfillment = fulfillmentSelector(getState())(intentID);

    if (fulfillment) {
      dispatch(deleteFulfillment(intentID));
    }
  }
};

/**
 * disabled canfulfill associated with multiple intentIDs
 */
export const deleteManyCanFulfillment = (nodeIDs) => (dispatch, getState) => {
  const { fulfillment } = skillMetaSelector(getState());
  const intentIDs = nodeIDs.map((node) => dispatch(getIntentID(node))).filter(Boolean);

  dispatch(updateFulfillment(update(fulfillment, { $unset: intentIDs })));
};

/**
 * disable Can Fulfillment for single block
 */
export const disableCanFulfillment = (nodeID) => (dispatch, getState) => {
  const node = Creator.nodeByIDSelector(getState())(nodeID);

  // case: when a single block with multiple steps is deleted
  if (!node.parentNode) {
    dispatch(deleteManyCanFulfillment(node.combinedNodes));
  } else {
    // when a single step is deleted
    dispatch(removeIntentFulfillment(nodeID));
  }
};

/**
 * when many blocks are selected, it selects all the parent nodeIDs
 */
export const disableManyCanFulfillment = (nodeIDs) => (dispatch, getState) => {
  const state = getState();
  const childNodeIDs = nodeIDs.reduce((acc, id) => {
    const node = Creator.nodeByIDSelector(state)(id);

    if (node?.combinedNodes.length) {
      return [...acc, ...node.combinedNodes];
    }
    return acc;
  }, []);

  dispatch(deleteManyCanFulfillment(childNodeIDs));
};
