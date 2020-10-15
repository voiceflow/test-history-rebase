import { Reducer, RootReducer } from '@/store/types';

import {
  AnyPrototypeAction,
  PrototypeAction,
  UpdatePrototype,
  UpdatePrototypeContext,
  UpdatePrototypeContextStore,
  UpdatePrototypeStatus,
} from './actions';
import { InputMode, PrototypeState, PrototypeStatus } from './types';

export * from './actions';
export * from './constants';
export * from './types';
export * from './selectors';
export * from './sideEffects';

export const INITIAL_STATE: PrototypeState = {
  ID: null,
  nlc: null,
  status: PrototypeStatus.IDLE,
  muted: false,
  startTime: 0,
  inputMode: InputMode.TEXT,
  showChips: true,
  context: {
    turn: {},
    trace: [],
    stack: [],
    storage: {},
    variables: {},
  },
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

const prototypeReducer: RootReducer<PrototypeState, AnyPrototypeAction> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PrototypeAction.UPDATE_TEST:
      return updatePrototypeReducer(state, action);
    case PrototypeAction.UPDATE_TEST_STATUS:
      return updatePrototypeStatusReducer(state, action);
    case PrototypeAction.UPDATE_TEST_CONTEXT:
      return updatePrototypeContextReducer(state, action);
    case PrototypeAction.UPDATE_TEST_CONTEXT_STORE:
      return updatePrototypeContextStoreReducer(state, action);
    default:
      return state;
  }
};

export default prototypeReducer;
