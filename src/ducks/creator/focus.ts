import { createSelector } from 'reselect';

import { createAction, createKeyedSelector } from '@/ducks/utils';
import { NodeData } from '@/models';
import { Action, Reducer, RootReducer } from '@/store/types';

import { AnyCreatorAction, CreatorAction } from './actions';
import * as Diagram from './diagram';
import { creatorStateSelector } from './selectors';

export type FocusState = {
  target: string | null;
  isActive: boolean;
  renameActiveRevision: string | null;
};

export const FOCUS_STATE_KEY = 'focus';

const INITIAL_FOCUS_STATE = {
  target: null,
  isActive: false,
  renameActiveRevision: null,
};

// actions

export enum FocusAction {
  SET_FOCUS = 'CREATOR:FOCUS:SET',
  CLEAR_FOCUS = 'CREATOR:FOCUS:CLEAR',
}

export type SetFocus = Action<FocusAction.SET_FOCUS, { nodeID: string; renameActiveRevision: string | null }>;

export type ClearFocus = Action<FocusAction.CLEAR_FOCUS>;

type AnyFocusAction = SetFocus | ClearFocus;

// reducers

export const setFocusReducer: Reducer<FocusState, SetFocus> = (state, { payload: { nodeID, renameActiveRevision } }) => {
  if (state.isActive && nodeID === state.target && renameActiveRevision === state.renameActiveRevision) {
    return state;
  }

  return {
    target: nodeID,
    isActive: true,
    renameActiveRevision,
  };
};

export const clearFocusReducer: Reducer<FocusState> = (state) => {
  if (!state.isActive) {
    return state;
  }

  return {
    ...state,
    isActive: false,
    renameActiveRevision: null,
  };
};

const focusReducer: RootReducer<FocusState, AnyFocusAction | AnyCreatorAction> = (state = INITIAL_FOCUS_STATE, action) => {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (action.type) {
    case CreatorAction.INITIALIZE_CREATOR:
    case CreatorAction.RESET_CREATOR:
      return INITIAL_FOCUS_STATE;
    case FocusAction.SET_FOCUS:
      return setFocusReducer(state, action);
    case FocusAction.CLEAR_FOCUS:
      return clearFocusReducer(state);
    default:
      return state;
  }
};

export default focusReducer;

// selectors

const rootSelector = createKeyedSelector(creatorStateSelector, FOCUS_STATE_KEY);

export { rootSelector as creatorFocusSelector };

export const focusedNodeSelector = createSelector([Diagram.nodeByIDSelector, rootSelector], (getNodeByID, focus) =>
  focus.target ? getNodeByID(focus.target) : null
);

export const focusedNodeDataSelector = createSelector([Diagram.dataByNodeIDSelector, rootSelector], (getDataByNodeID, focus) =>
  focus.target ? (getDataByNodeID(focus.target) as NodeData<unknown>) : null
);

// action creators

export const setFocus = (nodeID: string, renameActiveRevision: string | null = null): SetFocus =>
  createAction(FocusAction.SET_FOCUS, { nodeID, renameActiveRevision });

export const clearFocus = (): ClearFocus => createAction(FocusAction.CLEAR_FOCUS);
