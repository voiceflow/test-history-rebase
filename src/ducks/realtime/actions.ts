import { createAction } from '@/ducks/utils';
import { Action } from '@/store/types';

import { ResourceType } from './constants';
import { AnyNodeLock, RealtimeLocks } from './types';

export enum RealtimeAction {
  INITIALIZE_REALTIME = 'REALTIME:INITIALIZE',
  RESET_REALTIME = 'REALTIME:RESET',
  UPDATE_LAST_TIMESTAMP = 'REALTIME:LAST_TIMESTAMP:UPDATE',
  UPDATE_DIAGRAM_VIEWERS = 'REALTIME:DIAGRAM_VIEWERS:UPDATE',
  UPDATE_REALTIME_CONNECTION = 'REALTIME:CONNECTION:UPDATE',
  ADD_NODE_LOCKS = 'REALTIME:NODE_LOCKS:ADD',
  REMOVE_NODE_LOCKS = 'REALTIME:NODE_LOCKS:REMOVE',
  ADD_RESOURCE_LOCK = 'REALTIME:RESOURCE_LOCK:ADD',
  REMOVE_RESOURCE_LOCK = 'REALTIME:RESOURCE_LOCK:REMOVE',
  SET_ERROR_STATE = 'REALTIME:SET_ERROR_STATE',
  SET_SESSION_BUSY = 'REALTIME:SESSION_BUSY:SET',
  RESET_SESSION_BUSY = 'REALTIME:SESSION_BUSY:RESET',
  SET_RESTRICTION = 'REALTIME:RESTRICTION:SET',
  RESET_RESTRICTION = 'REALTIME:RESTRICTION:RESET',
}

// action types

export type InitializeRealtime = Action<RealtimeAction.INITIALIZE_REALTIME, { diagramID: string; locks: RealtimeLocks }>;

export type ResetRealtime = Action<RealtimeAction.RESET_REALTIME>;

export type UpdateLastTimestamp = Action<RealtimeAction.UPDATE_LAST_TIMESTAMP, number>;

export type UpdateDiagramViewers = Action<RealtimeAction.UPDATE_DIAGRAM_VIEWERS, RealtimeLocks['users']>;

export type AddNodeLocks = Action<RealtimeAction.ADD_NODE_LOCKS, { types: AnyNodeLock[]; targets: string[]; tabID: string }>;

export type RemoveNodeLocks = Action<RealtimeAction.REMOVE_NODE_LOCKS, { types: AnyNodeLock[]; targets: string[] }>;

export type AddResourceLock = Action<RealtimeAction.ADD_RESOURCE_LOCK, { resourceID: ResourceType; tabID: string }>;

export type RemoveResourceLock = Action<RealtimeAction.REMOVE_RESOURCE_LOCK, ResourceType>;

export type UpdateRealtimeConnection = Action<RealtimeAction.UPDATE_REALTIME_CONNECTION, boolean>;

export type SetErrorState = Action<RealtimeAction.SET_ERROR_STATE, boolean>;

export type SetSessionBusy = Action<RealtimeAction.SET_SESSION_BUSY>;

export type ResetSessionBusy = Action<RealtimeAction.RESET_SESSION_BUSY>;

export type SetRestriction = Action<RealtimeAction.SET_RESTRICTION>;

export type ResetRestriction = Action<RealtimeAction.RESET_RESTRICTION>;

export type AnyRealtimeAction =
  | InitializeRealtime
  | ResetRealtime
  | UpdateLastTimestamp
  | UpdateDiagramViewers
  | AddNodeLocks
  | RemoveNodeLocks
  | AddResourceLock
  | RemoveResourceLock
  | UpdateRealtimeConnection
  | SetErrorState
  | SetSessionBusy
  | ResetSessionBusy
  | SetRestriction
  | ResetRestriction;

// action creators

export const initializeRealtime = (diagramID: string, locks: WithOptional<RealtimeLocks, 'users'>): InitializeRealtime =>
  createAction(RealtimeAction.INITIALIZE_REALTIME, {
    diagramID,
    locks: {
      ...locks,
      users: locks.users || {},
    },
  });

export const resetRealtime = (): ResetRealtime => createAction(RealtimeAction.RESET_REALTIME);

export const updateLastTimestamp = (timestamp: number): UpdateLastTimestamp => createAction(RealtimeAction.UPDATE_LAST_TIMESTAMP, timestamp);

export const updateActiveDiagramViewers = (users: RealtimeLocks['users']): UpdateDiagramViewers =>
  createAction(RealtimeAction.UPDATE_DIAGRAM_VIEWERS, users);

export const addNodeLocks = (types: AnyNodeLock[], targets: string[], tabID: string): AddNodeLocks =>
  createAction(RealtimeAction.ADD_NODE_LOCKS, { types, targets, tabID });

export const removeNodeLocks = (types: AnyNodeLock[], targets: string[]): RemoveNodeLocks =>
  createAction(RealtimeAction.REMOVE_NODE_LOCKS, { types, targets });

export const addResourceLock = (resourceID: ResourceType, tabID: string): AddResourceLock =>
  createAction(RealtimeAction.ADD_RESOURCE_LOCK, { resourceID, tabID });

export const removeResourceLock = (resourceID: ResourceType): RemoveResourceLock => createAction(RealtimeAction.REMOVE_RESOURCE_LOCK, resourceID);

export const connectRealtime = (): UpdateRealtimeConnection => createAction(RealtimeAction.UPDATE_REALTIME_CONNECTION, true);

export const disconnectRealtime = (): UpdateRealtimeConnection => createAction(RealtimeAction.UPDATE_REALTIME_CONNECTION, false);

export const setErrorState = (): SetErrorState => createAction(RealtimeAction.SET_ERROR_STATE, true);

export const setSessionBusy = (): SetSessionBusy => createAction(RealtimeAction.SET_SESSION_BUSY);

export const resetSessionBusy = (): ResetSessionBusy => createAction(RealtimeAction.RESET_SESSION_BUSY);

export const setRealtimeRestriction = (): SetRestriction => createAction(RealtimeAction.SET_RESTRICTION);

export const resetRealtimeRestriction = (): ResetRestriction => createAction(RealtimeAction.RESET_RESTRICTION);
