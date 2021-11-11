import { Models } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { createSelector } from 'reselect';

import { createAction, createKeyedSelector } from '@/ducks/utils';
import { Action, Reducer, RootReducer } from '@/store/types';
import { getPortByType } from '@/utils/port';

import { AnyCreatorAction, CreatorAction } from './actions';
import * as Diagram from './diagram';
import { creatorStateSelector } from './selectors';

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

const focusReducer: RootReducer<FocusState, AnyFocusAction | AnyCreatorAction> = (state = INITIAL_FOCUS_STATE, action) => {
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

export const hasFocusedNode = createSelector([rootSelector], (focus) => focus.isActive);

export const focusedNodeDataSelector = createSelector([Diagram.dataByNodeIDSelector, rootSelector], (getDataByNodeID, focus) =>
  focus.target ? (getDataByNodeID(focus.target) as Realtime.NodeData<unknown>) : null
);

export const focusedNoMatchLinkIDSelector = createSelector(
  [focusedNodeSelector, Diagram.allPortsByIDsSelector, Diagram.linkIDsByPortIDSelector],
  (focusedNode, getPortsByIDs, getLinkIDsByPortID) => {
    const ports = getPortsByIDs(focusedNode?.ports.out ?? []);

    const noMatchPort = getPortByType(ports, Models.PortType.NO_MATCH) ?? ports[0];

    return noMatchPort ? getLinkIDsByPortID(noMatchPort.id)[0] : null;
  }
);

// action creators

export const setFocus = (nodeID: string): SetFocus => createAction(FocusAction.SET_FOCUS, { nodeID });

export const clearFocus = (): ClearFocus => createAction(FocusAction.CLEAR_FOCUS);
