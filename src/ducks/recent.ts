import update from 'immutability-helper';
import { persistReducer } from 'redux-persist';
import storageLocal from 'redux-persist/lib/storage';
import { createSelector } from 'reselect';

import { Action, Reducer, RootReducer } from '@/store/types';

import { createAction, createRootSelector } from './utils';

export type PrototypeConfig = {
  debug: boolean;
};

export type RecentState = {
  testing: PrototypeConfig;
};

export const STATE_KEY = 'recent';

const PERSIST_CONFIG = {
  key: STATE_KEY,
  storage: storageLocal,
};

export const INITIAL_STATE: RecentState = {
  testing: {
    debug: false,
  },
};

export enum RecentAction {
  UPDATE_RECENT_TESTING = 'RECENT:TESTING:UPDATE',
}

// action types

export type UpdateRecentTesting = Action<RecentAction.UPDATE_RECENT_TESTING, Partial<PrototypeConfig>>;

export type AnyRecentAction = UpdateRecentTesting;

// reducers

export const updateRecentTestingReducer: Reducer<RecentState, UpdateRecentTesting> = (state, { payload }) => {
  return update(state, { testing: { $merge: payload } });
};

const recentReducer: RootReducer<RecentState, AnyRecentAction> = (state = INITIAL_STATE, action) => {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (action.type) {
    case RecentAction.UPDATE_RECENT_TESTING:
      return updateRecentTestingReducer(state, action);
    default:
      return state;
  }
};

export default persistReducer(PERSIST_CONFIG, recentReducer);

// selectors

const rootSelector = createRootSelector(STATE_KEY);

export const recentTestingSelector = createSelector(rootSelector, ({ testing }) => testing);

//  action creators

export const updateRecentTesting = (payload: Partial<PrototypeConfig>): UpdateRecentTesting =>
  createAction(RecentAction.UPDATE_RECENT_TESTING, payload);
