import type * as Platform from '@voiceflow/platform-config';
import update from 'immutability-helper';
import { persistReducer } from 'redux-persist';
import storageLocal from 'redux-persist/lib/storage';
import { createSelector } from 'reselect';

import type { Action, Reducer, RootReducer } from '@/store/types';

import { createAction, createRootSelector } from './utils';

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

export enum RecentAction {
  UPDATE_RECENT_TESTING = 'RECENT:TESTING:UPDATE',
  UPDATE_RECENT_REDIRECT = 'RECENT:REDIRECT:UPDATE',
}

// action types

export type UpdateRecentPrototype = Action<RecentAction.UPDATE_RECENT_TESTING, Partial<PrototypeConfig>>;
export type UpdateRecentRedirect = Action<RecentAction.UPDATE_RECENT_REDIRECT, string | null>;

export type AnyRecentAction = UpdateRecentPrototype | UpdateRecentRedirect;

// reducers

export const updateRecentPrototypeReducer: Reducer<RecentState, UpdateRecentPrototype> = (state, { payload }) =>
  update(state, { prototype: { $merge: payload } });

const recentReducer: RootReducer<RecentState, AnyRecentAction> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case RecentAction.UPDATE_RECENT_TESTING:
      return updateRecentPrototypeReducer(state, action);
    case RecentAction.UPDATE_RECENT_REDIRECT:
      return { ...state, redirect: action.payload };
    default:
      return state;
  }
};

export default persistReducer(PERSIST_CONFIG, recentReducer);

// selectors

const rootSelector = createRootSelector(STATE_KEY);

export const recentRedirectSelector = createSelector([rootSelector], ({ redirect }) => redirect);

export const recentPrototypeSelector = createSelector([rootSelector], ({ prototype }) => prototype);

export const prototypeDebugSelector = createSelector([recentPrototypeSelector], ({ debug }) => debug);

//  action creators

export const updateRecentPrototype = (payload: Partial<PrototypeConfig>): UpdateRecentPrototype =>
  createAction(RecentAction.UPDATE_RECENT_TESTING, payload);

export const updateRecentRedirect = (payload: string | null): UpdateRecentRedirect =>
  createAction(RecentAction.UPDATE_RECENT_REDIRECT, payload);
