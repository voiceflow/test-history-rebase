import { createSelector } from 'reselect';

import client from '@/client';
import { activeDiagramIDSelector, activeSkillIDSelector } from '@/ducks/skill';
import { createAction, createRootSelector } from '@/ducks/utils';

export * from './socket';

export const STATE_KEY = 'realtime';
const DEFAULT_STATE = {
  /**
   * will be of the shape:
   * {
   *   blocks: {}
   *   flows: []
   *   users: {
   *     [tabID]: {}
   *   }
   * }
   */
  locks: null,
  lastTimestamp: null,
};

// actions

export const INITIALIZE_REALTIME = 'REALTIME:INITIALIZE';
export const RESET_REALTIME = 'REALTIME:RESET';
export const UPDATE_LAST_TIMESTAMP = 'REALTIME:LAST_TIMESTAMP:UPDATE';
export const ADD_DIAGRAM_VIEWER = 'REALTIME:DIAGRAM_VIEWER:ADD';
export const REMOVE_DIAGRAM_VIEWER = 'REALTIME:DIAGRAM_VIEWER:REMOVE';

// reducers

export const initializeRealtimeReducer = (state, { payload: locks }) => ({
  ...state,
  locks,
  lastTimestamp: null,
});

export const updateLastTimestampReducer = (state, { payload: lastTimestamp }) => ({
  ...state,
  lastTimestamp,
});

export const addDiagramViewerReducer = (state, { payload: { tabID, viewer } }) => ({
  ...state,
  locks: {
    ...state.locks,
    users: {
      ...state.locks.users,
      [tabID]: viewer,
    },
  },
});

export const removeDiagramViewerReducer = (state, { payload: tabID }) => {
  const {
    locks: {
      users: { [tabID]: _, ...users },
    },
  } = state;

  return {
    ...state,
    locks: {
      ...state.locks,
      users,
    },
  };
};

const realtimeReducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case INITIALIZE_REALTIME:
      return initializeRealtimeReducer(state, action);
    case UPDATE_LAST_TIMESTAMP:
      return updateLastTimestampReducer(state, action);
    case ADD_DIAGRAM_VIEWER:
      return addDiagramViewerReducer(state, action);
    case REMOVE_DIAGRAM_VIEWER:
      return removeDiagramViewerReducer(state, action);
    case RESET_REALTIME:
      return DEFAULT_STATE;
    default:
      return state;
  }
};

export default realtimeReducer;

// selectors

const rootSelector = createRootSelector(STATE_KEY);

export const realtimeLocksSelector = createSelector(
  rootSelector,
  ({ locks }) => locks
);

export const lastRealtimeTimestampSelector = createSelector(
  rootSelector,
  ({ lastTimestamp }) => lastTimestamp
);

export const isNodeLockedSelector = createSelector(
  realtimeLocksSelector,
  // eslint-disable-next-line no-unused-vars,lodash/prefer-constant
  ({ blocks }) => (nodeID) => false
);

// action creators

export const initializeRealtime = (locks) => createAction(INITIALIZE_REALTIME, locks);

export const resetRealtime = () => createAction(RESET_REALTIME);

export const updateLastTimestamp = (timestamp) => createAction(UPDATE_LAST_TIMESTAMP, timestamp);

export const addDiagramViewer = (tabID, viewer) => createAction(ADD_DIAGRAM_VIEWER, { tabID, viewer });

export const removeDiagramViewer = (tabID) => createAction(REMOVE_DIAGRAM_VIEWER, tabID);

// side effects

export const setupRealtimeConnection = (skillID, diagramID) => async (dispatch) => {
  const locks = await client.socket.realtime.initialize(skillID, diagramID);
  dispatch(initializeRealtime(locks));
};

export const terminateRealtimeConnection = () => async (dispatch) => {
  client.socket.realtime.terminate();
  dispatch(resetRealtime());
};

export const setupActiveDiagramConnection = () => async (dispatch, getState) => {
  const state = getState();
  const skillID = activeSkillIDSelector(state);
  const diagramID = activeDiagramIDSelector(state);

  await dispatch(setupRealtimeConnection(skillID, diagramID));
};

export const sendRealtimeUpdate = (action) => async (dispatch, getState) => {
  const isVolatile = action.meta && action.meta.volatile;

  if (isVolatile) {
    client.socket.realtime.sendUpdate(action);
  } else {
    const lastTimestamp = lastRealtimeTimestampSelector(getState());

    client.socket.realtime.sendUpdate(action, lastTimestamp);
  }
};

export const sendMouseMovement = (location) => async () => {
  client.socket.realtime.moveMouse(location);
};
