import update from 'immutability-helper';
import { persistReducer } from 'redux-persist';
import storageLocal from 'redux-persist/lib/storage';
import { createSelector } from 'reselect';

import { createAction, createRootSelector } from './utils';

export const STATE_KEY = 'recent';

const PERSIST_CONFIG = {
  key: STATE_KEY,
  storage: storageLocal,
};

export const INITIAL_STATE = {
  testing: {
    debug: false,
  },
};

// actions

export const UPDATE_RECENT_TESTING = 'RECENT:TESTING:UPDATE';

// reducers

export const updateRecentTestingReducer = (state, { payload }) => {
  return update(state, { testing: { $merge: payload } });
};

const recentReducer = (state = INITIAL_STATE, action) => {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (action.type) {
    case UPDATE_RECENT_TESTING:
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

export const updateRecentTesting = (payload) => createAction(UPDATE_RECENT_TESTING, payload);
