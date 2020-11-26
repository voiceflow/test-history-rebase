import * as ConnectedReactRouter from 'connected-react-router';
import CookiesJS from 'cookies-js';
import cuid from 'cuid';
import { PersistConfig, PersistPartial, persistReducer } from 'redux-persist';
import { CookieStorage } from 'redux-persist-cookie-storage';
import storageLocal from 'redux-persist/lib/storage';
import storageSession from 'redux-persist/lib/storage/session';
import { createSelector } from 'reselect';

import client from '@/client';
import { ROOT_DOMAIN } from '@/config';
import { FeatureFlag } from '@/config/features';
import { SessionType } from '@/constants';
import * as Account from '@/ducks/account';
import * as Feature from '@/ducks/feature';
import * as Workspace from '@/ducks/workspace';
import * as Models from '@/models';
import { Action, Reducer, RootReducer, Thunk } from '@/store/types';
import * as Cookies from '@/utils/cookies';
import * as Query from '@/utils/query';
import * as LogRocket from '@/vendors/logRocket';
import * as Userflow from '@/vendors/userflow';

import { goToDashboardWithSearch, goToLogin, goToOnboarding } from './router/actions';
import { compositeReducer, createAction, createRootSelector, duckLogger } from './utils';

export const STATE_KEY = 'session';
const COOKIE_OPTIONS = { path: '/', domain: ROOT_DOMAIN };

const TOKEN_PERSIST_CONFIG = {
  key: `${STATE_KEY}:token`,
  storage: new CookieStorage(CookiesJS, {
    setCookieOptions: COOKIE_OPTIONS,
  }),
  whitelist: ['value'],
};
const BROWSER_ID_PERSIST_CONFIG = {
  key: `${STATE_KEY}:browser_id`,
  storage: storageLocal,
  whitelist: ['value'],
};
const TAB_ID_PERSIST_CONFIG = {
  key: `${STATE_KEY}:tab_id`,
  storage: storageSession,
  whitelist: ['value'],
};

const log = duckLogger.child(STATE_KEY);

export type SessionState = {
  websocketsEnabled: boolean;
  token: { value: string | null } & PersistPartial;
  browserID: { value: string } & PersistPartial;
  tabID: { value: string } & PersistPartial;
};

const INITIAL_STATE: Omit<SessionState, 'token' | 'browserID' | 'tabID'> = {
  websocketsEnabled: true,
};

export enum SessionAction {
  SET_AUTH_TOKEN = 'SESSION:SET_AUTH_TOKEN',
  DISABLE_WEBSOCKETS = 'SESSION:DISABLE_WEBSOCKETS',
}

// action types

export type SetAuthToken = Action<SessionAction.SET_AUTH_TOKEN, string | null>;

export type DisableWebsockets = Action<SessionAction.DISABLE_WEBSOCKETS>;

type AnySessionAction = SetAuthToken | DisableWebsockets;

// reducers

export const authTokenReducer: RootReducer<{ value: string | null }, SetAuthToken> = (state = { value: null }, action) => {
  if (action.type === SessionAction.SET_AUTH_TOKEN) {
    return { ...state, value: action.payload };
  }

  return state;
};

export const disableWebsocketsReducer: Reducer<SessionState> = (state) => ({
  ...state,
  websocketsEnabled: false,
});

const sessionReducer: RootReducer<SessionState, AnySessionAction> = (state = INITIAL_STATE as SessionState, action) => {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (action.type) {
    case SessionAction.DISABLE_WEBSOCKETS:
      return disableWebsocketsReducer(state);
    default:
      return state;
  }
};

const sessionBoundReducer = <T>(config: PersistConfig, initialValue: T) =>
  persistReducer<{ value: T }, AnySessionAction>(config, (state = { value: initialValue }) => state);

export default compositeReducer(sessionReducer, {
  token: persistReducer(TOKEN_PERSIST_CONFIG, authTokenReducer),
  browserID: sessionBoundReducer(BROWSER_ID_PERSIST_CONFIG, cuid()),
  tabID: sessionBoundReducer(TAB_ID_PERSIST_CONFIG, cuid()),
});

// selectors

const rootSelector = createRootSelector(STATE_KEY);

export const authTokenSelector = createSelector([rootSelector], ({ token }) => token.value);

export const tabIDSelector = createSelector([rootSelector], ({ tabID }) => tabID.value);

export const browserIDSelector = createSelector([rootSelector], ({ browserID }) => browserID.value);

export const isWebsocketsEnabledSelector = createSelector([rootSelector], ({ websocketsEnabled }) => websocketsEnabled);

// action creators

export const setAuthToken = (token: string | null): SetAuthToken => createAction(SessionAction.SET_AUTH_TOKEN, token);

export const disableWebsockets = (): DisableWebsockets => createAction(SessionAction.DISABLE_WEBSOCKETS);

// side effects

/**
 * update the auth token in the store and in the cookie jar
 */
export const updateAuthToken = (token: string | null): Thunk => async (dispatch) => {
  if (token === null) {
    Cookies.removeAuthCookie();
  } else {
    Cookies.setAuthCookie(token);
  }

  dispatch(setAuthToken(token));
};

export const resetSession = (): Thunk => async (dispatch) => {
  await dispatch(updateAuthToken(null));
  dispatch(Account.resetAccount());
  dispatch(goToLogin());
};

export const logout = (): Thunk => async (dispatch, getState) => {
  const state = getState();
  const token = authTokenSelector(state)!;

  if (token) {
    try {
      await client.session.delete();
    } catch (err) {
      log.error(err);
    }
  }

  localStorage.clear();
  await dispatch(resetSession());
};

export const identifyUser = (user: Models.Account): Thunk => async (_, getState) => {
  const state = getState();
  const intercomEnabled = Feature.isFeatureEnabledSelector(state)(FeatureFlag.INTERCOM_INTEGRATION);
  const workspaceID = Workspace.activeWorkspaceIDSelector(state) || '';

  LogRocket.identify(user, workspaceID, intercomEnabled);
  await Userflow.identify(user);
};

export const restoreSession = (): Thunk => async (dispatch, getState) => {
  try {
    const state = getState();
    const token = authTokenSelector(state)!;
    const browserID = browserIDSelector(state);
    const tabID = tabIDSelector(state);
    const user = await client.user.get();

    await client.socket!.auth(token, browserID, tabID);
    dispatch(Account.updateAccount(user));

    await dispatch(identifyUser(user));

    const location = ConnectedReactRouter.getLocation(state);
    const search = Query.parse(location.search);
    if (search.promo || search.ob_plan) {
      dispatch(goToOnboarding());
    }
  } catch (err) {
    await dispatch(resetSession());
  }
};

const setSession = ({ token, user }: { token: string; user: Models.Account }): Thunk => async (dispatch, getState) => {
  const state = getState();
  const tabID = tabIDSelector(state);
  const browserID = browserIDSelector(state);
  Cookies.removeLastSessionCookie();
  await dispatch(updateAuthToken(token));

  await client.socket!.auth(token, browserID, tabID);
  dispatch(Account.updateAccount(user));

  const location = ConnectedReactRouter.getLocation(state);
  const search = Query.parse(location.search);

  // Show join workspace onboarding on first login of an invite or with a workspace promo
  if ((search.invite && user.first_login) || search.promo || search.ob_plan) {
    dispatch(goToOnboarding());
  } else if (search.invite || !user.first_login) {
    dispatch(goToDashboardWithSearch(location.search));
  } else {
    // TODO: put these in redux
    localStorage.setItem('is_first_upload', 'true');
    localStorage.setItem('is_first_session', 'true');
    dispatch(goToOnboarding());
  }

  await identifyUser(user);
};

export const ssoLogin = (data: { code: string; coupon?: string }): Thunk => async (dispatch) => {
  const { user, token } = await client.sso.login(data);

  await dispatch(setSession({ user, token }));
};

const createSession = (sessionType: SessionType) => (authRequest: unknown): Thunk => async (dispatch) => {
  const { user, token } = await client.session.create(sessionType, authRequest);

  await dispatch(setSession({ user, token }));
};

export const signup = createSession(SessionType.SIGN_UP);
export const basicAuthLogin = createSession(SessionType.BASIC_AUTH);
export const googleLogin = createSession(SessionType.GOOGLE);
export const facebookLogin = createSession(SessionType.FACEBOOK);
