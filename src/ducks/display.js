import client from '@/client';

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

// side effects

export const loadDisplaysForSkill = (skillID) => async (dispatch) => {
  const displays = await client.skill.findDisplays(skillID);

  dispatch(replaceDisplays(displays));

  return displays;
};
