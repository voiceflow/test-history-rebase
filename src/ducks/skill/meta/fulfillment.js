import update from 'immutability-helper';
import { createSelector } from 'reselect';
import { debounce } from 'throttle-debounce';

import client from '@/client';
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

export const fulfillmentSelector = createSelector(
  skillMetaSelector,
  ({ fulfillment }) => (intentID) => fulfillment?.[intentID]
);

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
