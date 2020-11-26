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
import { SessionType } from '@/constants';
import * as Account from '@/ducks/account';
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
  intercomVisible: boolean;
  token: { value: string | null } & PersistPartial;
  browserID: { value: string } & PersistPartial;
  tabID: { value: string } & PersistPartial;
};

const INITIAL_STATE: Omit<SessionState, 'token' | 'browserID' | 'tabID'> = {
  websocketsEnabled: true,
  intercomVisible: true,
};

export enum SessionAction {
  SET_AUTH_TOKEN = 'SESSION:SET_AUTH_TOKEN',
  DISABLE_WEBSOCKETS = 'SESSION:DISABLE_WEBSOCKETS',
  SET_INTERCOM_VISIBLE = 'SESSION:INTERCOM_VISIBLE:SET',
}

// action types

export type SetAuthToken = Action<SessionAction.SET_AUTH_TOKEN, string | null>;

export type DisableWebsockets = Action<SessionAction.DISABLE_WEBSOCKETS>;

export type SetIntercomVisible = Action<SessionAction.SET_INTERCOM_VISIBLE, boolean>;

type AnySessionAction = SetAuthToken | DisableWebsockets | SetIntercomVisible;

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

export const setIntercomVisibleReducer: Reducer<SessionState, SetIntercomVisible> = (state, { payload }) => ({
  ...state,
  intercomVisible: payload,
});

const sessionReducer: RootReducer<SessionState, AnySessionAction> = (state = INITIAL_STATE as SessionState, action) => {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (action.type) {
    case SessionAction.DISABLE_WEBSOCKETS:
      return disableWebsocketsReducer(state);
    case SessionAction.SET_INTERCOM_VISIBLE:
      return setIntercomVisibleReducer(state, action);
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

export const isIntercomVisibleSelector = createSelector([rootSelector], ({ intercomVisible }) => intercomVisible);

export const isLoggedInSelector = createSelector([authTokenSelector, Account.userIDSelector], (authToken, userID) => !!(authToken && userID));

// action creators

export const setAuthToken = (token: string | null): SetAuthToken => createAction(SessionAction.SET_AUTH_TOKEN, token);

export const disableWebsockets = (): DisableWebsockets => createAction(SessionAction.DISABLE_WEBSOCKETS);

export const setIntercomVisible = (isVisible: boolean): SetIntercomVisible => createAction(SessionAction.SET_INTERCOM_VISIBLE, isVisible);
export const showIntercom = () => setIntercomVisible(true);
export const hideIntercom = () => setIntercomVisible(false);

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

export const identifyUser = (user: Models.Account): Thunk => async () => {
  LogRocket.identify(user);
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

  await dispatch(identifyUser(user));
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
