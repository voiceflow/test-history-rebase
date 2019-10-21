import update from 'immutability-helper';
import { persistReducer } from 'redux-persist';
import storageLocal from 'redux-persist/lib/storage';
import { createSelector } from 'reselect';

import { createAction, createRootSelector } from './utils';

export const STATE_KEY = 'recent';

const MAX_RECENT_VOICES = 3;
const PERSIST_CONFIG = {
  key: STATE_KEY,
  storage: storageLocal,
};

const DEFAULT_STATE = {
  voices: [],
  testing: {
    debug: false,
  },
};

// actions

export const ADD_RECENT_VOICE = 'RECENT:VOICE:ADD';
export const UPDATE_RECENT_TESTING = 'RECENT:TESTING:UPDATE';

// reducers

export const addRecentVoiceReducer = (state, { payload }) => {
  const isDuplicate = state.voices.find(({ value }) => value === payload.value);
  if (isDuplicate) {
    return state;
  }

  return {
    ...state,
    voices: [...(state.voices.length === MAX_RECENT_VOICES ? state.voices.slice(1) : state.voices), payload],
  };
};

export const updateRecentTestingReducer = (state, { payload }) => {
  return update(state, { testing: { $merge: payload } });
};

const recentReducer = (state = DEFAULT_STATE, action) => {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (action.type) {
    case ADD_RECENT_VOICE:
      return addRecentVoiceReducer(state, action);
    case UPDATE_RECENT_TESTING:
      return updateRecentTestingReducer(state, action);
    default:
      return state;
  }
};

export default persistReducer(PERSIST_CONFIG, recentReducer);

// selectors

const rootSelector = createRootSelector(STATE_KEY);

export const recentVoicesSelector = createSelector(
  rootSelector,
  ({ voices }) => voices
);

export const recentTestingSelector = createSelector(
  rootSelector,
  ({ testing }) => testing
);

//  action creators

export const addRecentVoice = (voice) => createAction(ADD_RECENT_VOICE, voice);

export const updateRecentTesting = (payload) => createAction(UPDATE_RECENT_TESTING, payload);
