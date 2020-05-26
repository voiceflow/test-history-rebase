import update from 'immutability-helper';
import { createSelector } from 'reselect';

import { Action, Reducer, RootReducer } from '@/store/types';

import { createAction, createRootSelector } from './utils';

const SUCCESS_ICON = '/green-check.svg';
const WARNING_ICON = '/yellow-error.svg';

export type ErrorMessage = {
  icon: string;
  msg: string;
};

export type UserState = {
  canvasError: ErrorMessage[];
};

export const STATE_KEY = 'userSetting';
export const INITIAL_STATE: UserState = {
  canvasError: [],
};

export enum UserAction {
  CANVAS_ERROR = 'CANVAS_ERROR',
  CLOSE_CANVAS_ERROR = 'CLOSE_CANVAS_ERROR',
}

// action types

export type CanvasError = Action<UserAction.CANVAS_ERROR, { msg: string; icon: string }>;

export type CloseCanvasError = Action<UserAction.CLOSE_CANVAS_ERROR, number>;

type AnyUserAction = CanvasError | CloseCanvasError;

// reducers

const canvasErrorReducer: Reducer<UserState, CanvasError> = (state, { payload: error }) => ({
  ...state,
  canvasError: update(state.canvasError, { $splice: [[0, 1, error]] }),
});

const closeCanvasErrorReducer: Reducer<UserState, CloseCanvasError> = (state, { payload: index }) => ({
  ...state,
  canvasError: update(state.canvasError, { $splice: [[index, 1]] }),
});

const userReducer: RootReducer<UserState, AnyUserAction> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UserAction.CANVAS_ERROR:
      return canvasErrorReducer(state, action);
    case UserAction.CLOSE_CANVAS_ERROR:
      return closeCanvasErrorReducer(state, action);
    default:
      return state;
  }
};

export default userReducer;

// selectors

const rootSelector = createRootSelector(STATE_KEY);

export const canvasErrorSelector = createSelector(rootSelector, ({ canvasError }) => canvasError);

// action creators

export const setCanvasInfo = (error: string): CanvasError => createAction(UserAction.CANVAS_ERROR, { msg: error, icon: SUCCESS_ICON });

export const setCanvasError = (error: string): CanvasError => createAction(UserAction.CANVAS_ERROR, { msg: error, icon: WARNING_ICON });

export const closeCanvasError = (index: number): CloseCanvasError => createAction(UserAction.CLOSE_CANVAS_ERROR, index);
