import { createAction } from '@/ducks/utils';
import { Action } from '@/store/types';

import { Context, Store, StoreType, TestStatus, TestingState } from './types';

// actions

export enum TestingAction {
  UPDATE_TEST = 'TEST:UPDATE',
  UPDATE_TEST_STATUS = 'TEST:STATUS:UPDATE',
  UPDATE_TEST_CONTEXT = 'TEST:CONTEXT:UPDATE',
  UPDATE_TEST_CONTEXT_STORE = 'TEST:CONTEXT:STORE:UPDATE',
  UPDATE_TEST_TIME = 'TEST:TIME:UPDATE',
}

// action types
export type UpdateTesting = Action<TestingAction.UPDATE_TEST, Partial<TestingState>>;

export type UpdateTestingStatus = Action<TestingAction.UPDATE_TEST_STATUS, TestStatus>;

export type UpdateTestingContext = Action<TestingAction.UPDATE_TEST_CONTEXT, Partial<Context>>;

export type UpdateTestingContextStore = Action<TestingAction.UPDATE_TEST_CONTEXT_STORE, { store: StoreType; payload: Partial<Store> }>;

export type ResetTestingTime = Action<TestingAction.UPDATE_TEST_TIME, number>;

export type AnyTestingAction = UpdateTesting | UpdateTestingStatus | UpdateTestingContext | UpdateTestingContextStore | ResetTestingTime;

// action creators
export const updateTesting = (payload: Partial<TestingState>): UpdateTesting => createAction(TestingAction.UPDATE_TEST, payload);

export const updateTestingStatus = (payload: TestStatus): UpdateTestingStatus => createAction(TestingAction.UPDATE_TEST_STATUS, payload);

export const updateTestingContext = (payload: Partial<Context>): UpdateTestingContext => createAction(TestingAction.UPDATE_TEST_CONTEXT, payload);

export const updateTestingContextStore = (store: StoreType) => (payload: Partial<Store>): UpdateTestingContextStore =>
  createAction(TestingAction.UPDATE_TEST_CONTEXT_STORE, { store, payload });

export const updateVariables = updateTestingContextStore(StoreType.VARIABLES);
export const updateTurn = updateTestingContextStore(StoreType.TURN);
export const updateStorage = updateTestingContextStore(StoreType.STORAGE);

export const updateTestTime = (payload = Date.now()): ResetTestingTime => createAction(TestingAction.UPDATE_TEST_TIME, payload);
