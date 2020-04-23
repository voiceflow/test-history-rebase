import { Reducer, RootReducer } from '@/store/types';
import { filterEntries } from '@/utils/objects';

import {
  AddNodeLocks,
  AddResourceLock,
  AnyRealtimeAction,
  InitializeRealtime,
  RealtimeAction,
  RemoveNodeLocks,
  RemoveResourceLock,
  SetErrorState,
  UpdateDiagramViewers,
  UpdateLastTimestamp,
  UpdateRealtimeConnection,
} from './actions';
import { ResourceType } from './constants';
import { AnyNodeLock, RealtimeLocks, RealtimeState } from './types';

export * from './actions';
export * from './constants';
export * from './socket';
export * from './sideEffects';
export * from './selectors';
export * from './types';

export const INITIAL_STATE: RealtimeState = {
  locks: null,
  diagramID: null,
  lastTimestamp: null,
  connected: false,
  errorState: false,
  sessionBusy: false,
};

// reducers

type RealtimeReducer<A extends void | AnyRealtimeAction = void> = Reducer<RealtimeState, A>;

export const initializeRealtimeReducer: RealtimeReducer<InitializeRealtime> = (state, { payload: { diagramID, locks } }) => ({
  ...state,
  diagramID,
  locks,
  lastTimestamp: null,
  connected: true,
  errorState: false,
  sessionBusy: false,
});

export const updateLastTimestampReducer: RealtimeReducer<UpdateLastTimestamp> = (state, { payload: lastTimestamp }) => ({
  ...state,
  lastTimestamp,
});

export const updateDiagramViewersReducer: RealtimeReducer<UpdateDiagramViewers> = (state, { payload: users }) => {
  const tabIDs = Object.values(users).flatMap(Object.keys);
  const filterByTabID = <K extends string>(locks: Partial<Record<K, string>>): Partial<typeof locks> =>
    filterEntries(locks, (_: string, value: string) => tabIDs.includes(value));

  return {
    ...state,
    locks: {
      ...state.locks,
      blocks: Object.entries(state.locks!.blocks).reduce((acc, [key, value]) => Object.assign(acc, { [key]: filterByTabID(value) }), {}),
      resources: filterByTabID<ResourceType>(state.locks!.resources),
      users,
    } as RealtimeLocks,
  };
};

export const addNodeLocksReducer: RealtimeReducer<AddNodeLocks> = (state, { payload: { targets, types, tabID } }) => ({
  ...state,
  locks: {
    ...state.locks!,
    blocks: {
      ...state.locks!.blocks,
      ...types
        .map((type) => type.toLowerCase() as AnyNodeLock)
        .reduce(
          (acc, type) =>
            Object.assign(acc, {
              [type]: {
                ...state.locks!.blocks[type],
                ...targets.reduce((nodes, target) => Object.assign(nodes, { [target]: tabID }), {}),
              },
            }),
          {}
        ),
    },
  },
});

export const removeNodeLocksReducer: RealtimeReducer<RemoveNodeLocks> = (state, { payload: { types, targets } }) => ({
  ...state,
  locks: {
    ...state.locks!,
    blocks: {
      ...state.locks!.blocks,
      ...types.reduce(
        (acc, type) =>
          Object.assign(acc, {
            [type]: Object.entries(state.locks!.blocks[type] ?? {})
              .filter(([nodeID]) => !targets.includes(nodeID))
              .reduce((nodes, [key, value]) => Object.assign(nodes, { [key]: value }), {}),
          }),
        {}
      ),
    },
  },
});

export const addResourceLockReducer: RealtimeReducer<AddResourceLock> = (state, { payload: { resourceID, tabID } }) => ({
  ...state,
  locks: {
    ...state.locks!,
    resources: {
      ...state.locks!.resources,
      [resourceID]: tabID,
    },
  },
});

export const removeResourceLockReducer: RealtimeReducer<RemoveResourceLock> = (state, { payload: resourceID }) => {
  const { [resourceID]: _, ...nextResourceLocks } = state.locks!.resources;

  return {
    ...state,
    locks: {
      ...state.locks!,
      resources: nextResourceLocks,
    },
  };
};

export const updateRealtimeConnectionReducer: RealtimeReducer<UpdateRealtimeConnection> = (state, { payload: connected }) => ({
  ...state,
  connected,
});

export const setErrorStateReducer: RealtimeReducer<SetErrorState> = (state, { payload: errorState }) => ({ ...state, errorState });

export const setSessionBusyReducer: RealtimeReducer = (state) => ({ ...state, sessionBusy: true });

export const resetSessionBusyReducer: RealtimeReducer = (state) => ({ ...state, sessionBusy: false });

const realtimeReducer: RootReducer<RealtimeState, AnyRealtimeAction> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case RealtimeAction.INITIALIZE_REALTIME:
      return initializeRealtimeReducer(state, action);
    case RealtimeAction.UPDATE_LAST_TIMESTAMP:
      return updateLastTimestampReducer(state, action);
    case RealtimeAction.UPDATE_DIAGRAM_VIEWERS:
      return updateDiagramViewersReducer(state, action);
    case RealtimeAction.UPDATE_REALTIME_CONNECTION:
      return updateRealtimeConnectionReducer(state, action);
    case RealtimeAction.ADD_NODE_LOCKS:
      return addNodeLocksReducer(state, action);
    case RealtimeAction.REMOVE_NODE_LOCKS:
      return removeNodeLocksReducer(state, action);
    case RealtimeAction.ADD_RESOURCE_LOCK:
      return addResourceLockReducer(state, action);
    case RealtimeAction.REMOVE_RESOURCE_LOCK:
      return removeResourceLockReducer(state, action);
    case RealtimeAction.SET_ERROR_STATE:
      return setErrorStateReducer(state, action);
    case RealtimeAction.SET_SESSION_BUSY:
      return setSessionBusyReducer(state);
    case RealtimeAction.RESET_SESSION_BUSY:
      return resetSessionBusyReducer(state);
    case RealtimeAction.RESET_REALTIME:
      return INITIAL_STATE;
    default:
      return state;
  }
};

export default realtimeReducer;
