import { StoreType } from '@/constants/prototype';
import { createAction } from '@/ducks/utils';
import { Store } from '@/models';
import { DeviceType } from '@/pages/Prototype/constants';
import { Action } from '@/store/types';

import { Context, PrototypeMode, PrototypeState, PrototypeStatus, WebhookData } from './types';

// actions

export enum PrototypeAction {
  UPDATE_TEST = 'TEST:UPDATE',
  UPDATE_TEST_STATUS = 'TEST:STATUS:UPDATE',
  UPDATE_TEST_MODE = 'TEST:MODE:UPDATE',
  ADD_TEST_CONTEXT_HISTORY = 'TEST:CONTEXT:ADD',
  UPDATE_TEST_CONTEXT = 'TEST:CONTEXT:UPDATE',
  UPDATE_TEST_CONTEXT_STORE = 'TEST:CONTEXT:STORE:UPDATE',
  UPDATE_TEST_TIME = 'TEST:TIME:UPDATE',
  UPDATE_TEST_VISUAL_DEVICE = 'TEST:VISUAL_DEVICE:UPDATE',
  UPDATE_TEST_VISUAL_SOURCE = 'TEST:VISUAL_SOURCE:UPDATE',
  UPDATE_WEBHOOK = 'TEST:WEBHOOK:UPDATE',
}

// action types
export type UpdatePrototype = Action<PrototypeAction.UPDATE_TEST, Partial<PrototypeState>>;

export type UpdatePrototypeStatus = Action<PrototypeAction.UPDATE_TEST_STATUS, PrototypeStatus>;

export type UpdatePrototypeMode = Action<PrototypeAction.UPDATE_TEST_MODE, PrototypeMode>;

export type PushContextHistory = Action<PrototypeAction.ADD_TEST_CONTEXT_HISTORY, Context>;

export type UpdatePrototypeVisualDevice = Action<PrototypeAction.UPDATE_TEST_VISUAL_DEVICE, DeviceType>;

export type UpdatePrototypeVisualSource = Action<PrototypeAction.UPDATE_TEST_VISUAL_SOURCE, string>;

export type UpdatePrototypeContext = Action<PrototypeAction.UPDATE_TEST_CONTEXT, Partial<Context>>;

export type UpdatePrototypeContextStore = Action<PrototypeAction.UPDATE_TEST_CONTEXT_STORE, { store: StoreType; payload: Partial<Store> }>;

export type UpdatePrototypeWebhookData = Action<PrototypeAction.UPDATE_WEBHOOK, WebhookData>;

export type AnyPrototypeAction =
  | UpdatePrototype
  | PushContextHistory
  | UpdatePrototypeStatus
  | UpdatePrototypeMode
  | UpdatePrototypeVisualDevice
  | UpdatePrototypeVisualSource
  | UpdatePrototypeContext
  | UpdatePrototypeContextStore
  | UpdatePrototypeWebhookData;

// action creators
export const updatePrototype = (payload: Partial<PrototypeState>): UpdatePrototype => createAction(PrototypeAction.UPDATE_TEST, payload);

export const updatePrototypeStatus = (payload: PrototypeStatus): UpdatePrototypeStatus => createAction(PrototypeAction.UPDATE_TEST_STATUS, payload);

export const updatePrototypeMode = (payload: PrototypeMode): UpdatePrototypeMode => createAction(PrototypeAction.UPDATE_TEST_MODE, payload);

export const pushContextHistory = (payload: Context): PushContextHistory => createAction(PrototypeAction.ADD_TEST_CONTEXT_HISTORY, payload);

export const updatePrototypeVisualDevice = (payload: DeviceType): UpdatePrototypeVisualDevice =>
  createAction(PrototypeAction.UPDATE_TEST_VISUAL_DEVICE, payload);

export const updatePrototypeVisualSource = (nodeID: string): UpdatePrototypeVisualSource =>
  createAction(PrototypeAction.UPDATE_TEST_VISUAL_SOURCE, nodeID);

export const updatePrototypeContext = (payload: Partial<Context>): UpdatePrototypeContext =>
  createAction(PrototypeAction.UPDATE_TEST_CONTEXT, payload);

export const updatePrototypeContextStore = (store: StoreType) => (payload: Partial<Store>): UpdatePrototypeContextStore =>
  createAction(PrototypeAction.UPDATE_TEST_CONTEXT_STORE, { store, payload });

export const udpatePrototypeWebhookData = (payload: WebhookData): UpdatePrototypeWebhookData => createAction(PrototypeAction.UPDATE_WEBHOOK, payload);

export const updateVariables = updatePrototypeContextStore(StoreType.VARIABLES);
export const updateTurn = updatePrototypeContextStore(StoreType.TURN);
export const updateStorage = updatePrototypeContextStore(StoreType.STORAGE);
