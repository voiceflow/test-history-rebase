import { Utils } from '@voiceflow/common';
import type * as Platform from '@voiceflow/platform-config';
import update from 'immutability-helper';
import { persistReducer } from 'redux-persist';
import storageLocal from 'redux-persist/lib/storage';
import { createSelector } from 'reselect';

import { createRootReducer, createRootSelector } from './utils';

export interface PrototypeConfig {
  debug: boolean;
  intent: boolean;
  isGuided: boolean;
  platform: Platform.Constants.PlatformType;
  projectType: Platform.Constants.ProjectType;
  showVisuals: boolean;
}

export interface RecentState {
  prototype: Omit<PrototypeConfig, 'platform' | 'projectType'>;
  redirect: string | null;
}

export const STATE_KEY = 'recent';

const PERSIST_CONFIG = {
  key: STATE_KEY,
  storage: storageLocal,
};

export const INITIAL_STATE: RecentState = {
  prototype: {
    debug: true,
    intent: false,
    isGuided: false,
    showVisuals: false,
  },
  redirect: null,
};

// selectors

const rootSelector = createRootSelector(STATE_KEY);

export const recentRedirectSelector = createSelector([rootSelector], ({ redirect }) => redirect);

export const recentPrototypeSelector = createSelector([rootSelector], ({ prototype }) => prototype);

export const prototypeDebugSelector = createSelector([recentPrototypeSelector], ({ debug }) => debug);

//  action creators

const recentType = Utils.protocol.typeFactory('recent');

export const updateRecentPrototype = Utils.protocol.createAction<Partial<PrototypeConfig>>(
  recentType('prototype.UPDATE')
);

export const updateRecentRedirect = Utils.protocol.createAction<{ redirect: string | null }>(
  recentType('redirect.UPDATE')
);

// reducers

const recentReducer = createRootReducer(INITIAL_STATE)
  .mimerCase(updateRecentPrototype, (state, payload) => {
    state.prototype = update(state.prototype, { $merge: payload });
  })

  .mimerCase(updateRecentRedirect, (state, { redirect }) => {
    state.redirect = redirect;
  })

  .build();

export default persistReducer(PERSIST_CONFIG, recentReducer);
