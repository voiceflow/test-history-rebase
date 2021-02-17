import { DeviceType, GeneralRequest } from '@voiceflow/general-types';
import { StepData } from '@voiceflow/general-types/build/nodes/visual';

import { StoreType } from '@/constants/prototype';
import { createAction } from '@/ducks/utils';
import { Store } from '@/models';
import { Action } from '@/store/types';

import { Context, PrototypeMode, PrototypeShareViewSettings, PrototypeState, PrototypeStatus } from './types';

// actions

export enum PrototypeAction {
  UPDATE_TEST = 'TEST:UPDATE',
  UPDATE_TEST_STATUS = 'TEST:STATUS:UPDATE',
  UPDATE_TEST_MODE = 'TEST:MODE:UPDATE',
  ADD_TEST_CONTEXT_HISTORY = 'TEST:CONTEXT:ADD',
  UPDATE_TEST_CONTEXT = 'TEST:CONTEXT:UPDATE',
  UPDATE_TEST_CONTEXT_STORE = 'TEST:CONTEXT:STORE:UPDATE',
  UPDATE_TEST_TIME = 'TEST:TIME:UPDATE',
  UPDATE_TEST_VISUAL_DATA = 'TEST:VISUAL_DATA:UPDATE',
  ADD_TEST_VISUAL_DATA_HISTORY = 'TEST:VISUAL_DATA_HISTORY:ADD',
  UPDATE_TEST_VISUAL_DATA_HISTORY = 'TEST:VISUAL_DATA_HISTORY:UPDATE',
  UPDATE_TEST_VISUAL_DEVICE = 'TEST:VISUAL_DEVICE:UPDATE',
  UPDATE_WEBHOOK = 'TEST:WEBHOOK:UPDATE',
  UPDATE_PROTOTYPE_SETTINGS = 'TEST:PROTOTYPE_SETTINGS:UPDATE',
}

// action types
export type UpdatePrototype = Action<PrototypeAction.UPDATE_TEST, Partial<PrototypeState>>;

export type UpdatePrototypeStatus = Action<PrototypeAction.UPDATE_TEST_STATUS, PrototypeStatus>;

export type UpdatePrototypeMode = Action<PrototypeAction.UPDATE_TEST_MODE, { projectID: string; mode: PrototypeMode }>;

export type PushContextHistory = Action<PrototypeAction.ADD_TEST_CONTEXT_HISTORY, Context>;

export type UpdatePrototypeVisualDevice = Action<PrototypeAction.UPDATE_TEST_VISUAL_DEVICE, DeviceType>;

export type UpdatePrototypeVisualData = Action<PrototypeAction.UPDATE_TEST_VISUAL_DATA, null | StepData>;

export type PushPrototypeVisualDataHistory = Action<PrototypeAction.ADD_TEST_VISUAL_DATA_HISTORY, null | StepData>;

export type UpdatePrototypeVisualDataHistory = Action<PrototypeAction.UPDATE_TEST_VISUAL_DATA_HISTORY, (null | StepData)[]>;

export type UpdatePrototypeContext = Action<PrototypeAction.UPDATE_TEST_CONTEXT, Partial<Context>>;

export type UpdatePrototypeContextStore = Action<PrototypeAction.UPDATE_TEST_CONTEXT_STORE, { store: StoreType; payload: Partial<Store> }>;

export type UpdatePrototypeWebhookData = Action<PrototypeAction.UPDATE_WEBHOOK, GeneralRequest>;

export type UpdatePrototypeSettings = Action<PrototypeAction.UPDATE_PROTOTYPE_SETTINGS, PrototypeShareViewSettings>;

export type AnyPrototypeAction =
  | UpdatePrototype
  | PushContextHistory
  | UpdatePrototypeStatus
  | UpdatePrototypeMode
  | UpdatePrototypeVisualDevice
  | UpdatePrototypeVisualData
  | PushPrototypeVisualDataHistory
  | UpdatePrototypeVisualDataHistory
  | UpdatePrototypeContext
  | UpdatePrototypeContextStore
  | UpdatePrototypeSettings
  | UpdatePrototypeWebhookData;

// action creators
export const updatePrototype = (payload: Partial<PrototypeState>): UpdatePrototype => createAction(PrototypeAction.UPDATE_TEST, payload);

export const updatePrototypeStatus = (payload: PrototypeStatus): UpdatePrototypeStatus => createAction(PrototypeAction.UPDATE_TEST_STATUS, payload);

export const updatePrototypeMode = (projectID: string, mode: PrototypeMode): UpdatePrototypeMode =>
  createAction(PrototypeAction.UPDATE_TEST_MODE, { projectID, mode });

export const pushContextHistory = (payload: Context): PushContextHistory => createAction(PrototypeAction.ADD_TEST_CONTEXT_HISTORY, payload);

export const updatePrototypeVisualDevice = (payload: DeviceType): UpdatePrototypeVisualDevice =>
  createAction(PrototypeAction.UPDATE_TEST_VISUAL_DEVICE, payload);

export const updatePrototypeVisualData = (data: null | StepData): UpdatePrototypeVisualData =>
  createAction(PrototypeAction.UPDATE_TEST_VISUAL_DATA, data);

export const pushPrototypeVisualDataHistory = (data: null | StepData): PushPrototypeVisualDataHistory =>
  createAction(PrototypeAction.ADD_TEST_VISUAL_DATA_HISTORY, data);

export const updatePrototypeVisualDataHistory = (data: (null | StepData)[]): UpdatePrototypeVisualDataHistory =>
  createAction(PrototypeAction.UPDATE_TEST_VISUAL_DATA_HISTORY, data);

export const updatePrototypeContext = (payload: Partial<Context>): UpdatePrototypeContext =>
  createAction(PrototypeAction.UPDATE_TEST_CONTEXT, payload);

export const updatePrototypeContextStore = (store: StoreType) => (payload: Partial<Store>): UpdatePrototypeContextStore =>
  createAction(PrototypeAction.UPDATE_TEST_CONTEXT_STORE, { store, payload });

export const updatePrototypeWebhookData = (payload: GeneralRequest): UpdatePrototypeWebhookData =>
  createAction(PrototypeAction.UPDATE_WEBHOOK, payload);

export const updatePrototypeSettings = (payload: PrototypeShareViewSettings): UpdatePrototypeSettings =>
  createAction(PrototypeAction.UPDATE_PROTOTYPE_SETTINGS, payload);

export const updateVariables = updatePrototypeContextStore(StoreType.VARIABLES);
export const updateTurn = updatePrototypeContextStore(StoreType.TURN);
export const updateStorage = updatePrototypeContextStore(StoreType.STORAGE);
