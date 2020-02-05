import { createSelector } from 'reselect';

import { createAction, createRootSelector } from '@/ducks/utils';

import { INITIALIZE_CREATOR, RESET_CREATOR } from './actions';
import * as diagram from './diagram';
import { creatorStateSelector } from './selectors';

export const FOCUS_STATE_KEY = 'focus';

const DEFAULT_STATE = {
  target: null,
  isActive: false,
  renameActiveRevision: null,
};

// actions

export const SET_FOCUS = 'CREATOR:FOCUS:SET';
export const CLEAR_FOCUS = 'CREATOR:FOCUS:CLEAR';

// reducers

export const setFocusReducer = (state, { payload: { nodeID, renameActiveRevision } }) => {
  if (state.isActive && nodeID === state.target && renameActiveRevision === state.renameActiveRevision) {
    return state;
  }

  return {
    target: nodeID,
    isActive: true,
    renameActiveRevision,
  };
};

export const clearFocusReducer = (state) => {
  if (!state.isActive) {
    return state;
  }

  return {
    ...state,
    isActive: false,
    renameActiveRevision: null,
  };
};

function creatorFocusReducer(state = DEFAULT_STATE, action) {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (action.type) {
    case INITIALIZE_CREATOR:
    case RESET_CREATOR:
      return DEFAULT_STATE;
    case SET_FOCUS:
      return setFocusReducer(state, action);
    case CLEAR_FOCUS:
      return clearFocusReducer(state);
    default:
      return state;
  }
}

export default creatorFocusReducer;

// selectors

const rootSelector = createSelector(
  creatorStateSelector,
  createRootSelector(FOCUS_STATE_KEY)
);

export { rootSelector as creatorFocusSelector };

export const focusedNodeSelector = createSelector(
  diagram.nodeByIDSelector,
  rootSelector,
  (getNodeByID, focus) => focus.target && getNodeByID(focus.target)
);

export const focusedNodeDataSelector = createSelector(
  diagram.dataByNodeIDSelector,
  rootSelector,
  (getDataByNodeID, focus) => focus.target && getDataByNodeID(focus.target)
);

// action creators

export const setFocus = (nodeID, renameActiveRevision = null) => createAction(SET_FOCUS, { nodeID, renameActiveRevision });

export const clearFocus = () => createAction(CLEAR_FOCUS);
