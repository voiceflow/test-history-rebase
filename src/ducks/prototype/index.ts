import { Reducer, RootReducer } from '@/store/types';

import {
  AnyPrototypeAction,
  PrototypeAction,
  PushContextHistory,
  UpdatePrototype,
  UpdatePrototypeContext,
  UpdatePrototypeContextStore,
  UpdatePrototypeMode,
  UpdatePrototypeStatus,
  UpdatePrototypeVisualDevice,
  UpdatePrototypeVisualSource,
  UpdatePrototypeWebhookData,
} from './actions';
import { INITIAL_STATE } from './constants';
import { PrototypeState } from './types';

export * from './actions';
export * from './constants';
export * from './types';
export * from './selectors';
export * from './sideEffects';

// reducers

const updatePrototypeReducer: Reducer<PrototypeState, UpdatePrototype> = (state, { payload }) => ({
  ...state,
  ...payload,
});

const updatePrototypeStatusReducer: Reducer<PrototypeState, UpdatePrototypeStatus> = (state, { payload: status }) => ({
  ...state,
  status,
});

const updatePrototypeModeReducer: Reducer<PrototypeState, UpdatePrototypeMode> = (state, { payload: mode }) => ({
  ...state,
  mode,
});

const pushContextHistoryReducer: Reducer<PrototypeState, PushContextHistory> = (state, { payload }) => ({
  ...state,
  contextHistory: [...state.contextHistory, payload],
});

const updatePrototypeVisualDeviceReducer: Reducer<PrototypeState, UpdatePrototypeVisualDevice> = (state, { payload: device }) => ({
  ...state,
  visual: {
    ...state.visual,
    device,
  },
});

const updatePrototypeVisualSourceReducer: Reducer<PrototypeState, UpdatePrototypeVisualSource> = (state, { payload: nodeID }) => ({
  ...state,
  visual: {
    ...state.visual,
    sourceID: nodeID,
  },
});

const updatePrototypeContextReducer: Reducer<PrototypeState, UpdatePrototypeContext> = (state, { payload }) => ({
  ...state,
  context: {
    ...state.context,
    ...payload,
  },
});

const updatePrototypeContextStoreReducer: Reducer<PrototypeState, UpdatePrototypeContextStore> = (state, { payload: { store, payload } }) => ({
  ...state,
  context: {
    ...state.context,
    [store]: {
      ...state.context[store],
      ...payload,
    },
  },
});

const updateWebhookDataReducer: Reducer<PrototypeState, UpdatePrototypeWebhookData> = (state, { payload }) => ({
  ...state,
  webhook: {
    ...state.webhook,
    ...payload,
  },
});

const prototypeReducer: RootReducer<PrototypeState, AnyPrototypeAction> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PrototypeAction.UPDATE_TEST:
      return updatePrototypeReducer(state, action);
    case PrototypeAction.UPDATE_TEST_STATUS:
      return updatePrototypeStatusReducer(state, action);
    case PrototypeAction.UPDATE_TEST_MODE:
      return updatePrototypeModeReducer(state, action);
    case PrototypeAction.ADD_TEST_CONTEXT_HISTORY:
      return pushContextHistoryReducer(state, action);
    case PrototypeAction.UPDATE_TEST_VISUAL_DEVICE:
      return updatePrototypeVisualDeviceReducer(state, action);
    case PrototypeAction.UPDATE_TEST_VISUAL_SOURCE:
      return updatePrototypeVisualSourceReducer(state, action);
    case PrototypeAction.UPDATE_TEST_CONTEXT:
      return updatePrototypeContextReducer(state, action);
    case PrototypeAction.UPDATE_TEST_CONTEXT_STORE:
      return updatePrototypeContextStoreReducer(state, action);
    case PrototypeAction.UPDATE_WEBHOOK:
      return updateWebhookDataReducer(state, action);
    default:
      return state;
  }
};

export default prototypeReducer;
