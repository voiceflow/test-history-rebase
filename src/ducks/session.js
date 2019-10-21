import * as ConnectedReactRouter from 'connected-react-router';
import CookiesJS from 'cookies-js';
import cuid from 'cuid';
import queryString from 'query-string';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import { CookieStorage } from 'redux-persist-cookie-storage';
import storageSession from 'redux-persist/lib/storage/session';
import { createSelector } from 'reselect';

import client from '@/client';
import { ROOT_DOMAIN } from '@/config';
import { SessionType } from '@/constants';
import * as Cookies from '@/utils/cookies';
import { identifyAppCuesUser } from '@/vendors/appCues';
import { identifyLogRocketUser } from '@/vendors/logRocket';

import { resetAccount, updateAccount } from './account';
import { goToDashboardWithSearch, goToLogin, goToOnboarding } from './router';
import { createAction, createRootSelector } from './utils';

export const STATE_KEY = 'session';
const COOKIE_OPTIONS = { path: '/', domain: ROOT_DOMAIN };

const COOKIE_PERSIST_CONFIG = {
  key: `${STATE_KEY}:token`,
  storage: new CookieStorage(CookiesJS, {
    setCookieOptions: COOKIE_OPTIONS,
  }),
  whitelist: ['value'],
};
const SESSION_PERSIST_CONFIG = {
  key: `${STATE_KEY}:tab_id`,
  storage: storageSession,
  whitelist: ['value'],
};

// actions

export const SET_AUTH_TOKEN = 'SESSION:SET_AUTH_TOKEN';

// reducers

export const setAuthTokenReducer = (state, { payload: token }) => ({
  ...state,
  value: token,
});

export function authTokenReducer(state = { value: null }, action) {
  if (action.type === SET_AUTH_TOKEN) {
    return setAuthTokenReducer(state, action);
  }

  return state;
}

const authReducer = combineReducers({
  token: persistReducer(COOKIE_PERSIST_CONFIG, authTokenReducer),
  tabID: persistReducer(SESSION_PERSIST_CONFIG, (state = { value: cuid() }) => state),
});

export default authReducer;

// selectors

const rootSelector = createRootSelector(STATE_KEY);

export const authTokenSelector = createSelector(
  rootSelector,
  ({ token }) => token.value
);

export const tabIDSelector = createSelector(
  rootSelector,
  ({ tabID }) => tabID.value
);

// action creators

export const setAuthToken = (token) => createAction(SET_AUTH_TOKEN, token);

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
    const tabID = tabIDSelector(state);
    const user = await client.user.get();

    await client.socket?.auth(token, tabID);
    dispatch(updateAccount(user));

    identifyLogRocketUser(user);
  } catch (err) {
    await dispatch(resetSession());
  }
};

const createSession = (sessionType) => (authRequest) => async (dispatch, getState) => {
  const state = getState();
  const tabID = tabIDSelector(state);
  const { user, token } = await client.session.create(sessionType, authRequest);

  Cookies.removeLastSessionCookie();
  await dispatch(updateAuthToken(token));

  await client.socket?.auth(token, tabID);
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
  identifyAppCuesUser(user.id, authRequest);
};

export const signup = createSession(SessionType.SIGN_UP);
export const basicAuthLogin = createSession(SessionType.BASIC_AUTH);
export const googleLogin = createSession(SessionType.GOOGLE);
export const facebookLogin = createSession(SessionType.FACEBOOK);
