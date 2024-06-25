import type { BaseNode } from '@voiceflow/base-types';
import type * as Realtime from '@voiceflow/realtime-sdk';

import type { PrototypeStatus } from '@/constants/prototype';
import { StoreType } from '@/constants/prototype';
import { createAction } from '@/ducks/utils';
import type { Store } from '@/models';
import type { Action } from '@/store/types';

import type { Context, PrototypeState } from './types';

// actions

export enum PrototypeAction {
  UPDATE_TEST = 'TEST:UPDATE',
  UPDATE_TEST_STATUS = 'TEST:STATUS:UPDATE',
  ADD_TEST_CONTEXT_HISTORY = 'TEST:CONTEXT:ADD',
  UPDATE_TEST_CONTEXT = 'TEST:CONTEXT:UPDATE',
  UPDATE_TEST_CONTEXT_STORE = 'TEST:CONTEXT:STORE:UPDATE',
  UPDATE_TEST_TIME = 'TEST:TIME:UPDATE',
  UPDATE_TEST_VISUAL_DATA = 'TEST:VISUAL_DATA:UPDATE',
  ADD_TEST_VISUAL_DATA_HISTORY = 'TEST:VISUAL_DATA_HISTORY:ADD',
  UPDATE_TEST_VISUAL_DATA_HISTORY = 'TEST:VISUAL_DATA_HISTORY:UPDATE',
  UPDATE_TEST_VISUAL_DEVICE = 'TEST:VISUAL_DEVICE:UPDATE',
  UPDATE_PROTOTYPE_SETTINGS = 'TEST:PROTOTYPE_SETTINGS:UPDATE',
}

// action types
export type UpdatePrototype = Action<PrototypeAction.UPDATE_TEST, Partial<PrototypeState>>;

export type UpdatePrototypeStatus = Action<PrototypeAction.UPDATE_TEST_STATUS, PrototypeStatus>;

export type PushContextHistory = Action<PrototypeAction.ADD_TEST_CONTEXT_HISTORY, Context>;

export type UpdatePrototypeVisualDevice = Action<PrototypeAction.UPDATE_TEST_VISUAL_DEVICE, BaseNode.Visual.DeviceType>;

export type UpdatePrototypeVisualData = Action<
  PrototypeAction.UPDATE_TEST_VISUAL_DATA,
  null | BaseNode.Visual.StepData
>;

export type PushPrototypeVisualDataHistory = Action<
  PrototypeAction.ADD_TEST_VISUAL_DATA_HISTORY,
  null | BaseNode.Visual.StepData
>;

export type UpdatePrototypeVisualDataHistory = Action<
  PrototypeAction.UPDATE_TEST_VISUAL_DATA_HISTORY,
  (null | BaseNode.Visual.StepData)[]
>;

export type UpdatePrototypeContext = Action<PrototypeAction.UPDATE_TEST_CONTEXT, Partial<Context>>;

export type UpdatePrototypeContextStore = Action<
  PrototypeAction.UPDATE_TEST_CONTEXT_STORE,
  { store: StoreType; payload: Partial<Store> }
>;

export type UpdatePrototypeSettings = Action<
  PrototypeAction.UPDATE_PROTOTYPE_SETTINGS,
  { settings: Realtime.PrototypeSettings; patch: boolean }
>;

export type AnyPrototypeAction =
  | UpdatePrototype
  | PushContextHistory
  | UpdatePrototypeStatus
  | UpdatePrototypeVisualDevice
  | UpdatePrototypeVisualData
  | PushPrototypeVisualDataHistory
  | UpdatePrototypeVisualDataHistory
  | UpdatePrototypeContext
  | UpdatePrototypeContextStore
  | UpdatePrototypeSettings;

// action creators
export const updatePrototype = (payload: Partial<PrototypeState>): UpdatePrototype =>
  createAction(PrototypeAction.UPDATE_TEST, payload);

export const updatePrototypeStatus = (payload: PrototypeStatus): UpdatePrototypeStatus =>
  createAction(PrototypeAction.UPDATE_TEST_STATUS, payload);

export const pushContextHistory = (payload: Context): PushContextHistory =>
  createAction(PrototypeAction.ADD_TEST_CONTEXT_HISTORY, payload);

export const updatePrototypeVisualDevice = (payload: BaseNode.Visual.DeviceType): UpdatePrototypeVisualDevice =>
  createAction(PrototypeAction.UPDATE_TEST_VISUAL_DEVICE, payload);

export const updatePrototypeVisualData = (data: null | BaseNode.Visual.StepData): UpdatePrototypeVisualData =>
  createAction(PrototypeAction.UPDATE_TEST_VISUAL_DATA, data);

export const pushPrototypeVisualDataHistory = (data: null | BaseNode.Visual.StepData): PushPrototypeVisualDataHistory =>
  createAction(PrototypeAction.ADD_TEST_VISUAL_DATA_HISTORY, data);

export const updatePrototypeVisualDataHistory = (
  data: (null | BaseNode.Visual.StepData)[]
): UpdatePrototypeVisualDataHistory => createAction(PrototypeAction.UPDATE_TEST_VISUAL_DATA_HISTORY, data);

export const updatePrototypeContext = (payload: Partial<Context>): UpdatePrototypeContext =>
  createAction(PrototypeAction.UPDATE_TEST_CONTEXT, payload);

export const updatePrototypeContextStore =
  (store: StoreType) =>
  (payload: Partial<Store>): UpdatePrototypeContextStore =>
    createAction(PrototypeAction.UPDATE_TEST_CONTEXT_STORE, { store, payload });

export const updatePrototypeSettings = (settings: Realtime.PrototypeSettings, patch = true): UpdatePrototypeSettings =>
  createAction(PrototypeAction.UPDATE_PROTOTYPE_SETTINGS, { settings, patch });

export const updateVariables = updatePrototypeContextStore(StoreType.VARIABLES);
export const updateTurn = updatePrototypeContextStore(StoreType.TURN);
export const updateStorage = updatePrototypeContextStore(StoreType.STORAGE);
