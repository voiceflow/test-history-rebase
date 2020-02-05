import client from '@/client';
import { toast } from '@/componentsV2/Toast';

import createCRUDReducer, { createCRUDActionCreators, createCRUDSelectors } from './utils/crud';

export const STATE_KEY = 'display';

const displayReducer = createCRUDReducer(STATE_KEY);

export default displayReducer;

// selectors

export const {
  root: rootDisplaysSelector,
  all: allDisplaysSelector,
  byID: displayByIDSelector,
  findByIDs: displaysByIDsSelector,
  has: hasDisplaysSelector,
} = createCRUDSelectors(STATE_KEY);

// action creators

export const { add: addDisplay, update: updateDisplay, remove: removeDisplay, replace: replaceDisplays } = createCRUDActionCreators(STATE_KEY);

export const deleteDisplay = (displayID) => async (dispatch) => {
  await client.display.delete(displayID);
  dispatch(removeDisplay(displayID));
};

export const createDisplay = (skillId, data) => async (dispatch) => {
  try {
    const displayID = await client.display.create(skillId, data);
    const addDisplayPayload = {
      id: displayID,
      ...data,
    };

    dispatch(addDisplay(displayID, addDisplayPayload));

    return displayID;
  } catch (e) {
    toast.error('Error');
  }
};

export const duplicateDisplay = (displayID, skillId) => async (dispatch, getState) => {
  try {
    const state = getState();
    const displayData = displayByIDSelector(state)(displayID);
    const copyDisplayData = {
      document: displayData.document,
      datasource: displayData.datasource,
      title: displayData.title || 'title',
    };
    const newDisplayID = await client.display.create(skillId, copyDisplayData);
    const addDisplayPayload = {
      id: newDisplayID,
      ...copyDisplayData,
    };
    dispatch(addDisplay(newDisplayID, addDisplayPayload));
    return newDisplayID;
  } catch (e) {
    toast.error('Error duplicating display');
  }
};

export const updateDisplayData = (skillId, displayId, data) => async (dispatch) => {
  try {
    await client.display.update(displayId, skillId, data);
    dispatch(updateDisplay(displayId, data, true));
  } catch (e) {
    toast.error('Error');
  }
};

// side effects
export const loadDisplaysForSkill = (skillID) => async (dispatch) => {
  const displays = await client.skill.findDisplays(skillID);

  dispatch(replaceDisplays(displays));

  return displays;
};
