import {
  ADD_NODE_LOCKS,
  ADD_RESOURCE_LOCK,
  INITIALIZE_REALTIME,
  REMOVE_NODE_LOCKS,
  REMOVE_RESOURCE_LOCK,
  RESET_REALTIME,
  RESET_SESSION_BUSY,
  SET_ERROR_STATE,
  SET_SESSION_BUSY,
  UPDATE_DIAGRAM_VIEWERS,
  UPDATE_LAST_TIMESTAMP,
  UPDATE_REALTIME_CONNECTION,
} from './actions';

export * from './actions';
export * from './constants';
export * from './socket';
export * from './sideEffects';
export * from './selectors';

export const INITIAL_STATE = {
  /**
   * property "locks" will be of the shape:
   * {
   *   blocks: {
   *     movement: { [<blockID>]: <tabID> }
   *     edit: { [<blockID>]: <tabID> }
   *   }
   *   users: {
   *     [<diagramID>]: {
   *       [<tabID>]: <creatorID>
   *     }
   *   }
   *   resources: {
   *     [<resourceID>]: <tabID>
   *   }
   * }
   */
  locks: null,
  diagramID: null,
  lastTimestamp: null,
  connected: false,
  errorState: false,
  sessionBusy: false,
};

// reducers

export const initializeRealtimeReducer = (state, { payload: { diagramID, locks } }) => ({
  ...state,
  diagramID,
  locks,
  lastTimestamp: null,
  connected: true,
  errorState: false,
  sessionBusy: false,
});

export const updateLastTimestampReducer = (state, { payload: lastTimestamp }) => ({
  ...state,
  lastTimestamp,
});

export const updateDiagramViewersReducer = (state, { payload: users }) => {
  const tabIDs = Object.values(users).flatMap(Object.keys);
  const filterByTabID = (locks) =>
    Object.entries(locks).reduce((acc, [key, value]) => Object.assign(acc, tabIDs.includes(value) && { [key]: value }), {});

  return {
    ...state,
    locks: {
      ...state.locks,
      blocks: Object.entries(state.locks.blocks).reduce((acc, [key, value]) => Object.assign(acc, { [key]: filterByTabID(value) }), {}),
      resources: filterByTabID(state.locks.resources),
      users,
    },
  };
};

export const addNodeLocksReducer = (state, { payload: { targets, types, tabID } }) => ({
  ...state,
  locks: {
    ...state.locks,
    blocks: {
      ...state.locks.blocks,
      ...types
        .map((type) => type.toLowerCase())
        .reduce(
          (acc, type) =>
            Object.assign(acc, {
              [type]: {
                ...state.locks.blocks[type],
                ...targets.reduce((nodes, target) => Object.assign(nodes, { [target]: tabID }), {}),
              },
            }),
          {}
        ),
    },
  },
});

export const removeNodeLocksReducer = (state, { payload: { types, targets } }) => ({
  ...state,
  locks: {
    ...state.locks,
    blocks: {
      ...state.locks.blocks,
      ...types.reduce(
        (acc, type) =>
          Object.assign(acc, {
            [type]: Object.entries(state.locks.blocks[type] ?? {})
              .filter(([nodeID]) => !targets.includes(nodeID))
              .reduce((nodes, [key, value]) => Object.assign(nodes, { [key]: value }), {}),
          }),
        {}
      ),
    },
  },
});

export const addResourceLockReducer = (state, { payload: { resourceID, tabID } }) => ({
  ...state,
  locks: {
    ...state.locks,
    resources: {
      ...state.locks.resources,
      [resourceID]: tabID,
    },
  },
});

export const removeResourceLockReducer = (state, { payload: resourceID }) => {
  const { [resourceID]: _, ...nextResourceLocks } = state.locks.resources;

  return {
    ...state,
    locks: {
      ...state.locks,
      resources: nextResourceLocks,
    },
  };
};

export const updateRealtimeConnectionReducer = (state, { payload: connected }) => ({ ...state, connected });

export const setErrorStateReducer = (state, { payload: errorState }) => ({ ...state, errorState });

export const setSessionBusyReducer = (state) => ({ ...state, sessionBusy: true });

export const resetSessionBusyReducer = (state) => ({ ...state, sessionBusy: false });

const realtimeReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case INITIALIZE_REALTIME:
      return initializeRealtimeReducer(state, action);
    case UPDATE_LAST_TIMESTAMP:
      return updateLastTimestampReducer(state, action);
    case UPDATE_DIAGRAM_VIEWERS:
      return updateDiagramViewersReducer(state, action);
    case UPDATE_REALTIME_CONNECTION:
      return updateRealtimeConnectionReducer(state, action);
    case ADD_NODE_LOCKS:
      return addNodeLocksReducer(state, action);
    case REMOVE_NODE_LOCKS:
      return removeNodeLocksReducer(state, action);
    case ADD_RESOURCE_LOCK:
      return addResourceLockReducer(state, action);
    case REMOVE_RESOURCE_LOCK:
      return removeResourceLockReducer(state, action);
    case SET_ERROR_STATE:
      return setErrorStateReducer(state, action);
    case SET_SESSION_BUSY:
      return setSessionBusyReducer(state);
    case RESET_SESSION_BUSY:
      return resetSessionBusyReducer(state);
    case RESET_REALTIME:
      return INITIAL_STATE;
    default:
      return state;
  }
};

export default realtimeReducer;
