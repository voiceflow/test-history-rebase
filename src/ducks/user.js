import update from 'immutability-helper';

import { createAction } from './utils';

const SUCCESS_ICON = '/green-check.svg';
const WARNING_ICON = '/yellow-error.svg';

export const STATE_KEY = 'userSetting';
export const INITIAL_STATE = {
  canvasError: [],
  tab: 'blocks',
  menuOpen: true,
};

// actions

export const CANVAS_ERROR = 'CANVAS_ERROR';
export const CLOSE_CANVAS_ERROR = 'CLOSE_CANVAS_ERROR';

// reducers

const canvasErrorReducer = (state, { payload: error }) => ({
  ...state,
  canvasError: update(state.canvasError, { $splice: [[0, 1, error]] }),
});

const closeCanvasErrorReducer = (state, { payload: index }) => ({
  ...state,
  canvasError: update(state.canvasError, { $splice: [[index, 1]] }),
});

export default function userReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CANVAS_ERROR:
      return canvasErrorReducer(state, action);
    case CLOSE_CANVAS_ERROR:
      return closeCanvasErrorReducer(state, action);
    default:
      return state;
  }
}

// action creators

export const setCanvasInfo = (error) => createAction(CANVAS_ERROR, { msg: error, icon: SUCCESS_ICON });

export const setCanvasError = (error) => createAction(CANVAS_ERROR, { msg: error, icon: WARNING_ICON });

export const closeCanvasError = (index) => createAction(CLOSE_CANVAS_ERROR, index);
