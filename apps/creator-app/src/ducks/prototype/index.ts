import * as Realtime from '@voiceflow/realtime-sdk';
import { persistReducer } from 'redux-persist';
import storageLocal from 'redux-persist/lib/storage';

import type { Reducer, RootReducer } from '@/store/types';

import type {
  AnyPrototypeAction,
  PushContextHistory,
  PushPrototypeVisualDataHistory,
  UpdatePrototype,
  UpdatePrototypeContext,
  UpdatePrototypeContextStore,
  UpdatePrototypeSettings,
  UpdatePrototypeStatus,
  UpdatePrototypeVisualData,
  UpdatePrototypeVisualDataHistory,
  UpdatePrototypeVisualDevice,
} from './actions';
import { PrototypeAction, updatePrototypeSettings } from './actions';
import { INITIAL_STATE, STATE_KEY } from './constants';
import type { PrototypeState } from './types';

export * from './actions';
export * from './constants';
export * from './selectors';
export * from './sideEffects';
export * from './types';

const PERSIST_CONFIG = {
  key: STATE_KEY,
  storage: storageLocal,
  whitelist: ['mode'],
};

// reducers

const updatePrototypeReducer: Reducer<PrototypeState, UpdatePrototype> = (state, { payload }) => ({
  ...state,
  ...payload,
});

const updatePrototypeStatusReducer: Reducer<PrototypeState, UpdatePrototypeStatus> = (state, { payload: status }) => ({
  ...state,
  status,
});

const pushContextHistoryReducer: Reducer<PrototypeState, PushContextHistory> = (state, { payload }) => ({
  ...state,
  contextHistory: [...state.contextHistory, payload],
});

const updatePrototypeVisualDeviceReducer: Reducer<PrototypeState, UpdatePrototypeVisualDevice> = (
  state,
  { payload: device }
) => ({
  ...state,
  visual: {
    ...state.visual,
    device,
  },
});

const updatePrototypeVisualDataReducer: Reducer<PrototypeState, UpdatePrototypeVisualData> = (
  state,
  { payload: data }
) => ({
  ...state,
  visual: {
    ...state.visual,
    data,
  },
});

const pushPrototypeVisualDataHistoryReducer: Reducer<PrototypeState, PushPrototypeVisualDataHistory> = (
  state,
  { payload: data }
) => ({
  ...state,
  visual: {
    ...state.visual,
    dataHistory: [...state.visual.dataHistory, data],
  },
});

const updatePrototypeVisualDataHistoryReducer: Reducer<PrototypeState, UpdatePrototypeVisualDataHistory> = (
  state,
  { payload: data }
) => ({
  ...state,
  visual: {
    ...state.visual,
    dataHistory: data,
  },
});

const updatePrototypeContextReducer: Reducer<PrototypeState, UpdatePrototypeContext> = (state, { payload }) => ({
  ...state,
  context: {
    ...state.context,
    ...payload,
  },
});

const updatePrototypeContextStoreReducer: Reducer<PrototypeState, UpdatePrototypeContextStore> = (
  state,
  { payload: { store, payload } }
) => ({
  ...state,
  context: {
    ...state.context,
    [store]: {
      ...state.context[store],
      ...payload,
    },
  },
});

const updatePrototypeSettingsReducer: Reducer<PrototypeState, UpdatePrototypeSettings> = (
  state,
  { payload: { settings, patch } }
) => ({
  ...state,
  settings: patch ? { ...state.settings, ...settings } : settings,
});

const prototypeReducer: RootReducer<PrototypeState, AnyPrototypeAction> = (state = INITIAL_STATE, action) => {
  if (Realtime.version.replacePrototypeSettings.match(action)) {
    return updatePrototypeSettingsReducer(state, updatePrototypeSettings(action.payload.settings, false));
  }

  switch (action.type) {
    case PrototypeAction.UPDATE_TEST:
      return updatePrototypeReducer(state, action);
    case PrototypeAction.UPDATE_TEST_STATUS:
      return updatePrototypeStatusReducer(state, action);
    case PrototypeAction.ADD_TEST_CONTEXT_HISTORY:
      return pushContextHistoryReducer(state, action);
    case PrototypeAction.UPDATE_TEST_VISUAL_DEVICE:
      return updatePrototypeVisualDeviceReducer(state, action);
    case PrototypeAction.UPDATE_TEST_VISUAL_DATA:
      return updatePrototypeVisualDataReducer(state, action);
    case PrototypeAction.ADD_TEST_VISUAL_DATA_HISTORY:
      return pushPrototypeVisualDataHistoryReducer(state, action);
    case PrototypeAction.UPDATE_TEST_VISUAL_DATA_HISTORY:
      return updatePrototypeVisualDataHistoryReducer(state, action);
    case PrototypeAction.UPDATE_TEST_CONTEXT:
      return updatePrototypeContextReducer(state, action);
    case PrototypeAction.UPDATE_TEST_CONTEXT_STORE:
      return updatePrototypeContextStoreReducer(state, action);
    case PrototypeAction.UPDATE_PROTOTYPE_SETTINGS:
      return updatePrototypeSettingsReducer(state, action);
    default:
      return state;
  }
};

export default persistReducer(PERSIST_CONFIG, prototypeReducer);
