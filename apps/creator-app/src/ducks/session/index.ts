import { Utils } from '@voiceflow/common';
import compositeReducer from 'composite-reducer';

import { localPersistor, persistReducer, rehydrateReducer, sessionPersistor } from '@/ducks/utils/persist';
import { Reducer, RootReducer } from '@/store/types';
import * as Cookies from '@/utils/cookies';

import {
  AnySessionAction,
  SessionAction,
  SetActiveDiagramID,
  SetActiveDomainID,
  SetActiveProjectID,
  SetActiveVersionID,
  SetActiveWorkspaceID,
  SetAuthToken,
  SetPrototypeSidebarVisible,
} from './actions';
import { INITIAL_STATE, STATE_KEY } from './constants';
import { SessionState } from './types';

export * from './actions';
export * from './constants';
export * from './rpcs';
export * from './selectors';
export * from './sideEffects';
export * from './types';

export const tabIDPersistor = sessionPersistor<string>(STATE_KEY, 'tab_id');
export const browserIDPersistor = localPersistor<string>(STATE_KEY, 'browser_id');
export const anonymousIDPersistor = localPersistor<string>(STATE_KEY, 'anonymous_id');
export const activeWorkspaceIDPersistor = localPersistor<string | null>(STATE_KEY, 'active_workspace_id');

const createInitialAuthTokenState = () => ({
  value: Cookies.getAuthCookie() || null,
});

export const authTokenReducer: RootReducer<{ value: string | null }, SetAuthToken> = (state = createInitialAuthTokenState(), action) => {
  if (action.type === SessionAction.SET_AUTH_TOKEN) {
    return { ...state, value: action.payload };
  }

  return state;
};

export const setActiveWorkspaceIDReducer: RootReducer<string | null, SetActiveWorkspaceID> = (state = null, action) => {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (action.type) {
    case SessionAction.SET_ACTIVE_WORKSPACE_ID:
      return action.payload;
    default:
      return state;
  }
};

export const setActiveProjectIDReducer: Reducer<SessionState, SetActiveProjectID> = (state, { payload }) => ({
  ...state,
  activeProjectID: payload,
});

export const setActiveVersionIDReducer: Reducer<SessionState, SetActiveVersionID> = (state, { payload }) => ({
  ...state,
  activeVersionID: payload,
});

export const setActiveDiagramIDReducer: Reducer<SessionState, SetActiveDiagramID> = (state, { payload }) => ({
  ...state,
  activeDiagramID: payload,
});

export const setActiveDomainIDReducer: Reducer<SessionState, SetActiveDomainID> = (state, { payload }) => ({
  ...state,
  activeDomainID: payload,
});

export const setPrototypeSidebarVisibleReducer: Reducer<SessionState, SetPrototypeSidebarVisible> = (state, { payload }) => ({
  ...state,
  prototypeSidebarVisible: payload,
});

const sessionReducer: RootReducer<SessionState, AnySessionAction> = (state = INITIAL_STATE as SessionState, action) => {
  switch (action.type) {
    case SessionAction.SET_ACTIVE_PROJECT_ID:
      return setActiveProjectIDReducer(state, action);
    case SessionAction.SET_ACTIVE_VERSION_ID:
      return setActiveVersionIDReducer(state, action);
    case SessionAction.SET_ACTIVE_DIAGRAM_ID:
      return setActiveDiagramIDReducer(state, action);
    case SessionAction.SET_ACTIVE_DOMAIN_ID:
      return setActiveDomainIDReducer(state, action);
    case SessionAction.SET_PROTOTYPE_SIDEBAR_VISIBLE:
      return setPrototypeSidebarVisibleReducer(state, action);
    default:
      return state;
  }
};

export default compositeReducer(sessionReducer, {
  token: authTokenReducer,
  tabID: rehydrateReducer(tabIDPersistor, Utils.id.cuid()),
  browserID: rehydrateReducer(browserIDPersistor, Utils.id.cuid()),
  anonymousID: rehydrateReducer(anonymousIDPersistor, `anonymous-${Utils.id.cuid()}`),
  activeWorkspaceID: persistReducer(activeWorkspaceIDPersistor, setActiveWorkspaceIDReducer),
});
