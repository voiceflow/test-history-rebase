import { datadogRum } from '@datadog/browser-rum';
import { LOGROCKET_ENABLED } from '@ui/config';
import { Utils } from '@voiceflow/common';
import { matchPath } from 'react-router-dom';

import client from '@/client';
import { CREATOR_APP_ENDPOINT } from '@/config';
import { Path } from '@/config/routes';
import { resetAccount, updateAccount } from '@/ducks/account/actions';
import { goTo, goToDashboardWithSearch, goToLogin, goToOnboarding } from '@/ducks/router/actions';
import { locationSelector } from '@/ducks/router/selectors';
import * as Models from '@/models';
import { Query } from '@/models';
import { SyncThunk, Thunk } from '@/store/types';
import * as Cookies from '@/utils/cookies';
import { generateID } from '@/utils/env';
import * as QueryUtil from '@/utils/query';
import * as LogRocket from '@/vendors/logrocket';
import * as Support from '@/vendors/support';
import * as Userflow from '@/vendors/userflow';

import { setAuthToken } from './actions';
import { authTokenSelector } from './selectors';

enum SESSION_EVENTS {
  LOGOUT = 'logout',
  LOGIN = 'login',
}

const sessionChannel = window.BroadcastChannel ? new BroadcastChannel('session') : undefined;

sessionChannel?.addEventListener('message', (event) => {
  if (event.data === SESSION_EVENTS.LOGOUT) {
    window.store.dispatch(resetSession());
  }
  if (event.data === SESSION_EVENTS.LOGIN) {
    const authToken = Cookies.getAuthCookie();
    if (authToken) window.store.dispatch(updateAuthToken(authToken));
  }
});

/**
 * update the auth token in the store and in the cookie jar
 */
export const updateAuthToken =
  (token: string | null): SyncThunk =>
  (dispatch) => {
    if (token === null) {
      Cookies.removeAuthCookie();
    } else {
      Cookies.setAuthCookie(token);
    }

    dispatch(setAuthToken(token));
  };

export const resetSession = (): SyncThunk => (dispatch) => {
  localStorage.clear();
  if (!LOGROCKET_ENABLED) {
    datadogRum.clearUser();
  }

  dispatch(resetAccount());
  dispatch(updateAuthToken(null));

  dispatch(goToLogin(window.location.search));
};

export const logout = (): Thunk => async (dispatch, getState) => {
  const state = getState();
  const token = authTokenSelector(state);

  client.analytics.flush();

  if (token) {
    await client.auth.revoke().catch((error) => {
      if (LOGROCKET_ENABLED) {
        LogRocket.error(error);
      } else {
        datadogRum.addError(error);
      }
    });
  }

  sessionChannel?.postMessage(SESSION_EVENTS.LOGOUT);
  dispatch(resetSession());
};

export const identifyUser =
  (user: { name: string; email: string; creatorID: number; createdAt: string }): SyncThunk =>
  () => {
    const externalID = generateID(user.creatorID);

    if (LOGROCKET_ENABLED) {
      LogRocket.identify(externalID, user);
    } else {
      datadogRum.setUser({
        id: user.creatorID?.toString(),
        email: user.email,
        name: user.name,
      });
    }

    Support.identify(user);
    Userflow.identify(externalID, user);
  };

export const getUserAccount =
  (): Thunk<{
    name: string;
    email: string;
    image: string | null;
    verified: boolean;
    createdAt: string;
    creatorID: number;
  }> =>
  async () => {
    const user = await client.identity.user.getSelf();

    if (LOGROCKET_ENABLED) {
      LogRocket.identify(user.id.toString(), user);
    } else {
      datadogRum.setUser({
        id: user.id.toString(),
        email: user.email,
        name: user.name,
      });
    }

    return {
      ...user,
      verified: user.emailVerified,
      creatorID: user.id,
    };
  };

export const restoreSession = (): Thunk => async (dispatch, getState) => {
  try {
    const state = getState();
    const token = authTokenSelector(state);

    if (!token) throw new Error('no auth token set');

    const userAccount = await dispatch(getUserAccount());

    dispatch(updateAccount({ ...userAccount, created: userAccount.createdAt, creator_id: userAccount.creatorID }));

    dispatch(identifyUser(userAccount));

    const location = locationSelector(state);
    const search = QueryUtil.parse(location.search);
    const isVerifyingPath = matchPath(location.pathname, { path: '/account/confirm/:token' });

    if (search.ob_plan && !isVerifyingPath?.isExact) {
      dispatch(goToOnboarding());
    }
  } catch (err) {
    dispatch(resetSession());
  }
};

interface SetSessionOptions {
  user: Models.Account;
  token: string;
  redirectTo?: string;
}

const setSession =
  ({ user, token, redirectTo }: SetSessionOptions): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();

    Cookies.removeLastSessionCookie();

    dispatch(updateAuthToken(token));
    dispatch(updateAccount(user));

    sessionChannel?.postMessage(SESSION_EVENTS.LOGIN);

    const location = locationSelector(state);
    const search = QueryUtil.parse(location.search);

    dispatch(identifyUser({ ...user, createdAt: user.created, creatorID: user.creator_id }));

    if (redirectTo) {
      dispatch(goTo(redirectTo));
      // Show join workspace onboarding on first login of an invite
    } else if ((search.invite && user.first_login) || search.ob_plan) {
      dispatch(goToOnboarding());
    } else if (search.invite || !user.first_login) {
      dispatch(goToDashboardWithSearch(location.search));
    } else {
      dispatch(goToOnboarding());
    }
  };

interface SessionOptions {
  query?: Record<string, string>;
  redirectTo?: string;
  firstLogin?: boolean;
}

interface SigninPayload {
  email: string;
  password: string;
}

export const signin =
  (payload: SigninPayload, options: SessionOptions = {}): Thunk<Models.Account> =>
  async (dispatch) => {
    const { token } = await client.auth.authenticate(payload);

    Cookies.setAuthCookie(token);

    const userAccount = await dispatch(getUserAccount());

    const user: Models.Account = {
      ...userAccount,
      created: userAccount.createdAt,
      creator_id: userAccount.creatorID,
      first_login: options.firstLogin,
    };

    dispatch(setSession({ user, token, redirectTo: options?.redirectTo }));

    return user;
  };

interface SSOSigninPayload {
  token: string;
  isNewUser: boolean;
}

export const ssoSignIn =
  ({ token, isNewUser }: SSOSigninPayload, options: SessionOptions = {}): Thunk =>
  async (dispatch) => {
    dispatch(updateAuthToken(token));

    const userAccount = await dispatch(getUserAccount());

    const user: Models.Account = { ...userAccount, created: userAccount.createdAt, creator_id: userAccount.creatorID, first_login: isNewUser };

    dispatch(setSession({ user, token, redirectTo: options?.redirectTo }));
  };

interface SignupPayload {
  email: string;
  query: Query.Auth;
  password: string;
  lastName: string;
  firstName: string;
}

export const signup =
  ({ email, query, password, lastName, firstName }: SignupPayload): Thunk<{ creatorID: number; email: string }> =>
  async (dispatch) => {
    const userName = `${firstName} ${lastName}`.trim();

    const user = await client.identity.user.create({
      user: { name: userName, email },
      password,
      metadata: {
        utm: { utm_last_name: lastName, utm_first_name: firstName },
        inviteParams: query,
      },
    });

    await dispatch(signin({ email, password }, { query, firstLogin: true }));

    return {
      creatorID: user.id,
      email: user.email,
    };
  };

export const googleLogin = (): Thunk => async () => {
  const url = await client.auth.v1.sso.getGoogleLoginURL(`${CREATOR_APP_ENDPOINT}${Path.LOGIN_SSO_CALLBACK}${window.location.search}`);

  window.location.assign(url);
};

export const facebookLogin = (): Thunk => async () => {
  const url = await client.auth.v1.sso.getFacebookLoginURL(`${CREATOR_APP_ENDPOINT}${Path.LOGIN_SSO_CALLBACK}${window.location.search}`);

  window.location.assign(url);
};

export const getSamlLoginURL =
  (email: string): Thunk<string | null> =>
  async () => {
    if (!Utils.emails.isValidEmail(email)) return null;

    return client.auth.v1.sso.getSaml2LoginURL(email, `${CREATOR_APP_ENDPOINT}${Path.LOGIN_SSO_CALLBACK}${window.location.search}`).catch(() => null);
  };
