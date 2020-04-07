import { Reducer, RootReducer } from '@/store/types';

import { AnyTestingAction, TestingAction, UpdateTesting, UpdateTestingContext, UpdateTestingContextStore, UpdateTestingStatus } from './actions';
import { TestStatus, TestingState } from './types';

export * from './actions';
export * from './types';
export * from './selectors';
export * from './sideEffects';

export const INITIAL_STATE: TestingState = {
  ID: null,
  nlc: null,
  status: TestStatus.IDLE,
  startTime: 0,
  context: {
    turn: {},
    trace: [],
    stack: [],
    storage: {},
    variables: {},
  },
};

// reducers

const updateTestingReducer: Reducer<TestingState, UpdateTesting> = (state, { payload }) => ({
  ...state,
  ...payload,
});

const updateTestingStatusReducer: Reducer<TestingState, UpdateTestingStatus> = (state, { payload: status }) => ({
  ...state,
  status,
});

const updateTestingContextReducer: Reducer<TestingState, UpdateTestingContext> = (state, { payload }) => ({
  ...state,
  context: {
    ...state.context,
    ...payload,
  },
});

const updateTestingContextStoreReducer: Reducer<TestingState, UpdateTestingContextStore> = (state, { payload: { store, payload } }) => ({
  ...state,
  context: {
    ...state.context,
    [store]: {
      ...state.context[store],
      ...payload,
    },
  },
});

const testReducer: RootReducer<TestingState, AnyTestingAction> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TestingAction.UPDATE_TEST:
      return updateTestingReducer(state, action);
    case TestingAction.UPDATE_TEST_STATUS:
      return updateTestingStatusReducer(state, action);
    case TestingAction.UPDATE_TEST_CONTEXT:
      return updateTestingContextReducer(state, action);
    case TestingAction.UPDATE_TEST_CONTEXT_STORE:
      return updateTestingContextStoreReducer(state, action);
    default:
      return state;
  }
};

export default testReducer;
