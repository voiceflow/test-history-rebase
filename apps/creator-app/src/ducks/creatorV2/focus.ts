import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { createSelector } from 'reselect';

import { createAction, createSubSelector } from '@/ducks/utils';
import type { Action, Reducer, RootReducer } from '@/store/types';

import {
  creatorStateSelector,
  getLinkIDsByPortIDSelector,
  getNodeByIDSelector,
  getNodeDataByIDSelector,
} from './selectors';

export interface FocusState {
  target: string | null;
  isActive: boolean;
}

export const FOCUS_STATE_KEY = 'focus';

export const INITIAL_FOCUS_STATE = {
  target: null,
  isActive: false,
};

// actions

export enum FocusAction {
  SET_FOCUS = 'CREATOR:FOCUS:SET',
  CLEAR_FOCUS = 'CREATOR:FOCUS:CLEAR',
}

export type SetFocus = Action<FocusAction.SET_FOCUS, { nodeID: string }>;

export type ClearFocus = Action<FocusAction.CLEAR_FOCUS>;

type AnyFocusAction = SetFocus | ClearFocus;

// reducers

export const setFocusReducer: Reducer<FocusState, SetFocus> = (state, { payload: { nodeID } }) => {
  if (state.isActive && nodeID === state.target) {
    return state;
  }

  return {
    target: nodeID,
    isActive: true,
  };
};

export const clearFocusReducer: Reducer<FocusState> = (state) => {
  if (!state.isActive) {
    return state;
  }

  return {
    ...state,
    isActive: false,
  };
};

const focusReducer: RootReducer<FocusState, AnyFocusAction> = (state = INITIAL_FOCUS_STATE, action) => {
  switch (action.type) {
    case Realtime.creator.reset.type:
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

const rootSelector = createSubSelector(creatorStateSelector, FOCUS_STATE_KEY);

export { rootSelector as creatorFocusSelector };

export const focusedNodeSelector = createSelector([getNodeByIDSelector, rootSelector], (getNodeByID, focus) =>
  getNodeByID({ id: focus.target })
);

export const hasFocusedNode = createSelector([rootSelector], (focus) => focus.isActive);

export const focusedNodeDataSelector = createSelector(
  [getNodeDataByIDSelector, rootSelector],
  (getDataByNodeID, focus): Realtime.NodeData<unknown> | null => getDataByNodeID({ id: focus.target })
);

export const focusedNoMatchLinkIDSelector = createSelector(
  [focusedNodeSelector, getLinkIDsByPortIDSelector],
  (focusedNode, getLinkIDs) => {
    const noMatchPortID = focusedNode?.ports.out.builtIn[BaseModels.PortType.NO_MATCH];

    return noMatchPortID ? getLinkIDs({ id: noMatchPortID })[0] ?? null : null;
  }
);

// action creators

export const setFocus = (nodeID: string): SetFocus => createAction(FocusAction.SET_FOCUS, { nodeID });

export const clearFocus = (): ClearFocus => createAction(FocusAction.CLEAR_FOCUS);
