import { ActionCreators } from 'redux-undo';
import { createSelector } from 'reselect';

import client from '@/client';
import { toast } from '@/componentsV2/Toast';
import * as Creator from '@/ducks/creator';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as Skill from '@/ducks/skill';
import { createAction, createRootSelector } from '@/ducks/utils';
import * as Workspace from '@/ducks/workspace';

import { LockType } from './constants';
import * as Socket from './socket';
import { createServerAction, removeSelfFromLocks } from './utils';

export * from './constants';

export * from './socket';

export const STATE_KEY = 'realtime';
const DEFAULT_STATE = {
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
  sessionBusy: false,
};

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
            [type]: Object.entries(state.locks.blocks[type])
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

const realtimeReducer = (state = DEFAULT_STATE, action) => {
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
      return DEFAULT_STATE;
    default:
      return state;
  }
};

export default realtimeReducer;

// selectors

const rootSelector = createRootSelector(STATE_KEY);

export const realtimeDiagramIDSelector = createSelector(
  rootSelector,
  ({ diagramID }) => diagramID
);

export const realtimeLocksSelector = createSelector(
  rootSelector,
  ({ locks }) => locks
);

export const isRealtimeConnectedSelector = createSelector(
  rootSelector,
  ({ connected }) => connected
);

export const isErrorStateSelector = createSelector(
  rootSelector,
  ({ errorState }) => errorState
);

export const lastRealtimeTimestampSelector = createSelector(
  rootSelector,
  ({ lastTimestamp }) => lastTimestamp
);

export const isNodeLockedSelector = createSelector(
  realtimeLocksSelector,
  ({ blocks }) => (lockType, nodeID) => !!blocks[lockType][nodeID]
);

export const isNodeMovementLockedSelector = createSelector(
  isNodeLockedSelector,
  (isNodeLocked) => (nodeID) => isNodeLocked(LockType.MOVEMENT, nodeID)
);

export const isNodeEditLockedSelector = createSelector(
  isNodeLockedSelector,
  (isNodeLocked) => (nodeID) => isNodeLocked(LockType.EDIT, nodeID)
);

export const deletionLockedNodesSelector = createSelector(
  realtimeLocksSelector,
  ({ blocks }) => ({ ...blocks[LockType.MOVEMENT], ...blocks[LockType.EDIT] })
);

export const lockOwnerTabIDSelector = createSelector(
  realtimeLocksSelector,
  ({ blocks }) => (lockType, nodeID) => blocks[lockType][nodeID]
);

export const reourceLockOwnerTabIDSelector = createSelector(
  realtimeLocksSelector,
  ({ resources }) => (resourceType) => resources[resourceType]
);

export const isSessionBusy = createSelector(
  rootSelector,
  ({ sessionBusy }) => sessionBusy
);

/**
 * get the tabID by the creatorID
 */
export const creatorMappingSelector = createSelector(
  realtimeLocksSelector,
  lockOwnerTabIDSelector,
  ({ users }, getTabID) => (lockType, nodeID, diagramID) => {
    const tabID = getTabID(lockType, nodeID);

    return [tabID, users[diagramID]?.[tabID]];
  }
);

/**
 * get the team member who has the node locked
 */
export const lockOwnerSelector = createSelector(
  Creator.creatorDiagramIDSelector,
  creatorMappingSelector,
  Workspace.distinctWorkspaceMemberSelector,
  (diagramID, getCreatorMapping, getWorkspaceMember) => (lockType, nodeID) => {
    const [tabID, creatorID] = getCreatorMapping(lockType, nodeID, diagramID);
    return getWorkspaceMember(creatorID, tabID);
  }
);

/**
 * get the team member who has the node edit locked
 */
export const editLockOwnerSelector = createSelector(
  lockOwnerSelector,
  (getLockOwner) => (nodeID) => getLockOwner(LockType.EDIT, nodeID)
);

/**
 * get the team member who has the resource locked
 */
export const resourceLockOwnerSelector = createSelector(
  realtimeLocksSelector,
  reourceLockOwnerTabIDSelector,
  Workspace.distinctWorkspaceMemberSelector,
  ({ users }, getTabID, getWorkspaceMember) => (resourceType) => {
    const tabID = getTabID(resourceType);
    const found = Object.values(users)
      .flatMap(Object.entries)
      .find(([key]) => key === tabID);

    if (found) {
      const [, creatorID] = found;
      return getWorkspaceMember(creatorID, tabID);
    }

    return null;
  }
);

export const isResourceLockedSelector = createSelector(
  realtimeLocksSelector,
  (locks) => (resourceID) => !!locks.resources[resourceID]
);

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

// side effects

export const updateDiagramViewers = (users) => async (dispatch, getState) => {
  const state = getState();
  const diagramID = Skill.activeDiagramIDSelector(state);
  const workspaceMemberSelector = Workspace.workspaceMemberSelector(state);
  const diagramViewers = Object.values(users[diagramID]);
  const newMembers = diagramViewers.filter((viewer) => !workspaceMemberSelector(viewer));

  if (newMembers.length) {
    const workspaceID = Workspace.activeWorkspaceIDSelector(state);

    dispatch(Workspace.getMembers(workspaceID));
  }

  // reinitialize history if no other collaborators present
  if (diagramViewers.length === 1) {
    dispatch(Creator.saveHistory({ force: true, preventUpdate: true }));
    dispatch(ActionCreators.clearHistory());
  }

  dispatch(updateActiveDiagramViewers(users));
};

export const sendHeartbeat = () => () => client.socket.realtime.sendHeartbeat();

export const sendRealtimeUpdate = (action) => async (_, getState) => {
  const state = getState();
  const lastTimestamp = lastRealtimeTimestampSelector(state);
  const isConnected = isRealtimeConnectedSelector(state);

  if (isConnected) {
    const serverAction = createServerAction(action);
    const lockAction = action?.meta?.lock;

    await client.socket.realtime.sendUpdate(action, lastTimestamp, lockAction, serverAction);
  }
};

export const sendRealtimeVolatileUpdate = (action) => (_, getState) => {
  const isConnected = isRealtimeConnectedSelector(getState());

  if (isConnected) {
    client.socket.realtime.sendVolatileUpdate(action);
  }
};

export const sendRealtimeProjectUpdate = (action) => async (_, getState) => {
  const state = getState();
  const lastTimestamp = lastRealtimeTimestampSelector(state);
  const isConnected = isRealtimeConnectedSelector(state);

  if (isConnected) {
    const lockAction = action?.meta?.lock;

    await client.socket.realtime.sendProjectUpdate(action, lastTimestamp, lockAction);
  }
};

export const setupRealtimeConnection = (skillID, diagramID) => async (dispatch, getState) => {
  const tabID = Session.tabIDSelector(getState());

  try {
    const locks = await client.socket.realtime.initialize(skillID, diagramID);

    dispatch(initializeRealtime(diagramID, removeSelfFromLocks(locks, tabID)));
    await dispatch(sendRealtimeUpdate(Socket.reconnectNoop()));
  } catch (e) {
    // if socket throws an error then session is busy on another browser
    dispatch(setSessionBusy());
  }
};

export const terminateRealtimeConnection = () => async (dispatch) => {
  dispatch(disconnectRealtime());
  await client.socket.realtime.terminate();
  dispatch(resetRealtime());
};

export const setupActiveDiagramConnection = () => async (dispatch, getState) => {
  const state = getState();
  const skillID = Skill.activeSkillIDSelector(state);
  const diagramID = Skill.activeDiagramIDSelector(state);

  await dispatch(setupRealtimeConnection(skillID, diagramID));
};

export const handleRealtimeTakeover = () => async (dispatch) => {
  await client.socket.realtime.initiateSessionTakeOver();
  dispatch(resetSessionBusy());
};

export const handleSessionCancelled = (data) => async (dispatch, getState) => {
  const currentWorkspaceID = Workspace.activeWorkspaceIDSelector(getState());

  await dispatch(Workspace.removeWorkspace(data.workspaceId));

  if (currentWorkspaceID === data.workspaceId) {
    dispatch(Router.goToDashboard());
  }

  toast.info(`You are no longer a collaborator for "${data.workspaceName}" workspace`);
};
