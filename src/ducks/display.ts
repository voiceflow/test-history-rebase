import client from '@/client';
import { DisplayPayload } from '@/client/display';
import { toast } from '@/components/Toast';
import { Display } from '@/models';
import { Thunk } from '@/store/types';

import createCRUDReducer, { createCRUDActionCreators, createCRUDSelectors } from './utils/crud';

export const STATE_KEY = 'display';

const displayReducer = createCRUDReducer<Display>(STATE_KEY);

export default displayReducer;

// selectors

export const {
  root: rootDisplaysSelector,
  all: allDisplaysSelector,
  byID: displayByIDSelector,
  findByIDs: displaysByIDsSelector,
  has: hasDisplaysSelector,
} = createCRUDSelectors<Display>(STATE_KEY);

// action creators

export const { add: addDisplay, update: updateDisplay, remove: removeDisplay, replace: replaceDisplays } = createCRUDActionCreators<Display>(
  STATE_KEY
);

// side effects

export const deleteDisplay = (displayID: string): Thunk => async (dispatch) => {
  await client.display.delete(displayID);
  dispatch(removeDisplay(displayID));
};

export const createDisplay = (skillID: string, data: DisplayPayload): Thunk<string | null> => async (dispatch) => {
  try {
    const displayID = await client.display.create(skillID, data);
    const display = await client.display.get(displayID);

    dispatch(addDisplay(displayID, display));

    return displayID;
  } catch (e) {
    toast.error('Error');

    return null;
  }
};

export const duplicateDisplay = (displayID: string, skillID: string): Thunk<string | null> => async (dispatch, getState) => {
  try {
    const state = getState();
    const displayData = displayByIDSelector(state)(displayID);
    const copyDisplayData = {
      document: displayData.document,
      datasource: displayData.datasource,
      title: displayData.name || 'title',
    };

    return await dispatch(createDisplay(skillID, copyDisplayData));
  } catch (e) {
    toast.error('Error duplicating display');

    return null;
  }
};

export const updateDisplayData = (skillID: string, displayID: string, data: Partial<DisplayPayload>): Thunk => async (dispatch) => {
  try {
    await client.display.update(displayID, skillID, data);
    dispatch(updateDisplay(displayID, data, true));
  } catch (e) {
    toast.error('Error');
  }
};

// side effects
export const loadDisplaysForSkill = (skillID: string): Thunk<Display[]> => async (dispatch) => {
  const displays = await client.skill.findDisplays(skillID);

  dispatch(replaceDisplays(displays));

  return displays;
};
