import { createAction } from '@/ducks/utils';
import { Action } from '@/store/types';

import { Context, PrototypeMode, PrototypeState, PrototypeStatus, Store, StoreType } from './types';

// actions

export enum PrototypeAction {
  UPDATE_TEST = 'TEST:UPDATE',
  UPDATE_TEST_STATUS = 'TEST:STATUS:UPDATE',
  UPDATE_TEST_MODE = 'TEST:MODE:UPDATE',
  UPDATE_TEST_CONTEXT = 'TEST:CONTEXT:UPDATE',
  UPDATE_TEST_CONTEXT_STORE = 'TEST:CONTEXT:STORE:UPDATE',
  UPDATE_TEST_TIME = 'TEST:TIME:UPDATE',
}

// action types
export type UpdatePrototype = Action<PrototypeAction.UPDATE_TEST, Partial<PrototypeState>>;

export type UpdatePrototypeStatus = Action<PrototypeAction.UPDATE_TEST_STATUS, PrototypeStatus>;

export type UpdatePrototypeMode = Action<PrototypeAction.UPDATE_TEST_MODE, PrototypeMode>;

export type UpdatePrototypeContext = Action<PrototypeAction.UPDATE_TEST_CONTEXT, Partial<Context>>;

export type UpdatePrototypeContextStore = Action<PrototypeAction.UPDATE_TEST_CONTEXT_STORE, { store: StoreType; payload: Partial<Store> }>;

export type AnyPrototypeAction = UpdatePrototype | UpdatePrototypeStatus | UpdatePrototypeMode | UpdatePrototypeContext | UpdatePrototypeContextStore;

// action creators
export const updatePrototype = (payload: Partial<PrototypeState>): UpdatePrototype => createAction(PrototypeAction.UPDATE_TEST, payload);

export const updatePrototypeStatus = (payload: PrototypeStatus): UpdatePrototypeStatus => createAction(PrototypeAction.UPDATE_TEST_STATUS, payload);

export const updatePrototypeMode = (payload: PrototypeMode): UpdatePrototypeMode => createAction(PrototypeAction.UPDATE_TEST_MODE, payload);

export const updatePrototypeContext = (payload: Partial<Context>): UpdatePrototypeContext =>
  createAction(PrototypeAction.UPDATE_TEST_CONTEXT, payload);

export const updatePrototypeContextStore = (store: StoreType) => (payload: Partial<Store>): UpdatePrototypeContextStore =>
  createAction(PrototypeAction.UPDATE_TEST_CONTEXT_STORE, { store, payload });

export const updateVariables = updatePrototypeContextStore(StoreType.VARIABLES);
export const updateTurn = updatePrototypeContextStore(StoreType.TURN);
export const updateStorage = updatePrototypeContextStore(StoreType.STORAGE);
