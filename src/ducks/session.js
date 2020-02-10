import * as ConnectedReactRouter from 'connected-react-router';
import CookiesJS from 'cookies-js';
import cuid from 'cuid';
import queryString from 'query-string';
import { persistReducer } from 'redux-persist';
import { CookieStorage } from 'redux-persist-cookie-storage';
import storageLocal from 'redux-persist/lib/storage';
import storageSession from 'redux-persist/lib/storage/session';
import { createSelector } from 'reselect';

import client from '@/client';
import { ROOT_DOMAIN } from '@/config';
import { SessionType } from '@/constants';
import * as Cookies from '@/utils/cookies';
import { identity } from '@/utils/functional';
import { identifyLogRocketUser } from '@/vendors/logRocket';

import { resetAccount, updateAccount } from './account';
import { goToDashboardWithSearch, goToLogin, goToOnboarding } from './router/actions';
import { compositeReducer, createAction, createRootSelector } from './utils';

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

const DEFAULT_STATE = {
  websocketsEnabled: true,
  token: { value: null },
  browserID: { value: cuid() },
  tabID: { value: cuid() },
};

// actions

export const SET_AUTH_TOKEN = 'SESSION:SET_AUTH_TOKEN';
export const DISABLE_WEBSOCKETS = 'SESSION:DISABLE_WEBSOCKETS';

// reducers

export const setAuthTokenReducer = (state, { payload: token }) => ({
  ...state,
  value: token,
});

export function authTokenReducer(state, action) {
  if (action.type === SET_AUTH_TOKEN) {
    return setAuthTokenReducer(state, action);
  }

  return state;
}

export const disableWebsocketsReducer = (state) => ({
  ...state,
  websocketsEnabled: false,
});

const sessionReducer = (state = DEFAULT_STATE, action) => {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (action.type) {
    case DISABLE_WEBSOCKETS:
      return disableWebsocketsReducer(state);
    default:
      return state;
  }
};

export default compositeReducer(sessionReducer, {
  token: persistReducer(TOKEN_PERSIST_CONFIG, authTokenReducer),
  browserID: persistReducer(BROWSER_ID_PERSIST_CONFIG, identity),
  tabID: persistReducer(TAB_ID_PERSIST_CONFIG, identity),
});

// selectors

const rootSelector = createRootSelector(STATE_KEY);

export const authTokenSelector = createSelector(rootSelector, ({ token }) => token.value);

export const tabIDSelector = createSelector(rootSelector, ({ tabID }) => tabID.value);

export const browserIDSelector = createSelector(rootSelector, ({ browserID }) => browserID.value);

export const isWebsocketsEnabledSelector = createSelector(rootSelector, ({ websocketsEnabled }) => websocketsEnabled);

// action creators

export const setAuthToken = (token) => createAction(SET_AUTH_TOKEN, token);

export const disableWebsockets = () => createAction(DISABLE_WEBSOCKETS);

// side effects

/**
 * update the auth token in the store and in the cookie jar
 *
 * @param {string} token authentication token
 * @returns {function}
 */
export const updateAuthToken = (token) => async (dispatch) => {
  if (token === null) {
    Cookies.removeAuthCookie();
  } else {
    Cookies.setAuthCookie(token);
  }

  dispatch(setAuthToken(token));
};

export const resetSession = () => async (dispatch) => {
  await dispatch(updateAuthToken(null));
  dispatch(resetAccount());
  dispatch(goToLogin());
};

export const logout = () => async (dispatch) => {
  try {
    await client.session.delete();
  } catch (err) {
    console.error(err);
  }

  localStorage.clear();
  await dispatch(resetSession());
};

export const restoreSession = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const token = authTokenSelector(state);
    const browserID = browserIDSelector(state);
    const tabID = tabIDSelector(state);
    const user = await client.user.get();

    await client.socket.auth(token, browserID, tabID);
    dispatch(updateAccount(user));

    identifyLogRocketUser(user);
  } catch (err) {
    await dispatch(resetSession());
  }
};

const createSession = (sessionType) => (authRequest) => async (dispatch, getState) => {
  const state = getState();
  const browserID = browserIDSelector(state);
  const tabID = tabIDSelector(state);
  const { user, token } = await client.session.create(sessionType, authRequest);

  Cookies.removeLastSessionCookie();
  await dispatch(updateAuthToken(token));

  await client.socket.auth(token, browserID, tabID);
  dispatch(updateAccount(user));

  const location = ConnectedReactRouter.getLocation(state);
  const search = queryString.parse(location.search);

  if (search.invite || !user.first_login) {
    dispatch(goToDashboardWithSearch(location.search));
  } else {
    // TODO: put these in redux
    localStorage.setItem('is_first_upload', 'true');
    localStorage.setItem('is_first_session', 'true');
    dispatch(goToOnboarding());
  }

  identifyLogRocketUser(user);
};

export const signup = createSession(SessionType.SIGN_UP);
export const basicAuthLogin = createSession(SessionType.BASIC_AUTH);
export const googleLogin = createSession(SessionType.GOOGLE);
export const facebookLogin = createSession(SessionType.FACEBOOK);
