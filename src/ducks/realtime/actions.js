import { createAction } from '@/ducks/utils';

// actions

export const INITIALIZE_REALTIME = 'REALTIME:INITIALIZE';
export const RESET_REALTIME = 'REALTIME:RESET';
export const UPDATE_LAST_TIMESTAMP = 'REALTIME:LAST_TIMESTAMP:UPDATE';
export const UPDATE_DIAGRAM_VIEWERS = 'REALTIME:DIAGRAM_VIEWERS:UPDATE';
export const UPDATE_REALTIME_CONNECTION = 'REALTIME:CONNECTION:UPDATE';
export const ADD_NODE_LOCKS = 'REALTIME:NODE_LOCKS:ADD';
export const REMOVE_NODE_LOCKS = 'REALTIME:NODE_LOCKS:REMOVE';
export const ADD_RESOURCE_LOCK = 'REALTIME:RESOURCE_LOCK:ADD';
export const REMOVE_RESOURCE_LOCK = 'REALTIME:RESOURCE_LOCK:REMOVE';
export const SET_ERROR_STATE = 'REALTIME:SET_ERROR_STATE';
export const SET_SESSION_BUSY = 'REALTIME:SESSION_BUSY:SET';
export const RESET_SESSION_BUSY = 'REALTIME:SESSION_BUSY:RESET';

// action creators

export const initializeRealtime = (diagramID, locks) =>
  createAction(INITIALIZE_REALTIME, {
    diagramID,
    locks: {
      ...locks,
      users: locks.users || {},
    },
  });

export const resetRealtime = () => createAction(RESET_REALTIME);

export const updateLastTimestamp = (timestamp) => createAction(UPDATE_LAST_TIMESTAMP, timestamp);

export const updateActiveDiagramViewers = (users) => createAction(UPDATE_DIAGRAM_VIEWERS, users);

export const addNodeLocks = (types, targets, tabID) => createAction(ADD_NODE_LOCKS, { types, targets, tabID });

export const removeNodeLocks = (types, targets) => createAction(REMOVE_NODE_LOCKS, { types, targets });

export const addResourceLock = (resourceID, tabID) => createAction(ADD_RESOURCE_LOCK, { resourceID, tabID });

export const removeResourceLock = (resourceID) => createAction(REMOVE_RESOURCE_LOCK, resourceID);

export const connectRealtime = () => createAction(UPDATE_REALTIME_CONNECTION, true);

export const disconnectRealtime = () => createAction(UPDATE_REALTIME_CONNECTION, false);

export const setErrorState = () => createAction(SET_ERROR_STATE, true);

export const setSessionBusy = () => createAction(SET_SESSION_BUSY);

export const resetSessionBusy = () => createAction(RESET_SESSION_BUSY);
