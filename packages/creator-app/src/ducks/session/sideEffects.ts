import { Vendors } from '@voiceflow/ui';
import { batch } from 'react-redux';
import { matchPath } from 'react-router-dom';

import client from '@/client';
import { SSOConvertPayload, SSOLoginPayload } from '@/client/sso';
import { SessionType } from '@/constants';
import { resetAccount, updateAccount } from '@/ducks/account/actions';
import { goToDashboardWithSearch, goToLogin, goToOnboarding } from '@/ducks/router/actions';
import { locationSelector } from '@/ducks/router/selectors';
import * as Models from '@/models';
import { SyncThunk, Thunk } from '@/store/types';
import * as Cookies from '@/utils/cookies';
import { generateID } from '@/utils/env';
import * as Query from '@/utils/query';
import * as Sentry from '@/vendors/sentry';
import * as Userflow from '@/vendors/userflow';

import { setAuthToken, setIntercomUserHMAC } from './actions';
import { authTokenSelector, browserIDSelector, tabIDSelector } from './selectors';

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

export const resetSession = (): Thunk => async (dispatch) => {
  batch(() => {
    dispatch(resetAccount());
    dispatch(updateAuthToken(null));
    dispatch(setIntercomUserHMAC(null));
  });

  await client.socket.logout().catch(Sentry.error);

  dispatch(goToLogin());
};

export const logout = (): Thunk => async (dispatch, getState) => {
  const state = getState();
  const token = authTokenSelector(state);

  if (token) {
    await client.session.delete().catch(Sentry.error);
  }

  localStorage.clear();
  await dispatch(resetSession());
};

export const identifyUser =
  ({ creator_id, ...user }: Models.Account): Thunk =>
  async () => {
    const externalID = generateID(creator_id);

    Vendors.LogRocket.identify(externalID, user);
    await Userflow.identify(externalID, user);
  };

export const restoreSession = (): Thunk => async (dispatch, getState) => {
  try {
    const state = getState();
    const token = authTokenSelector(state);
    const browserID = browserIDSelector(state);
    const tabID = tabIDSelector(state);
    const user = await client.user.get();

    if (!token) throw new Error('no auth token set');

    await client.socket!.auth(token, browserID, tabID);

    dispatch(updateAccount(user));

    await dispatch(identifyUser(user));

    const location = locationSelector(state);
    const search = Query.parse(location.search);

    const isVerifyingPath = matchPath(location.pathname, { path: '/account/confirm/:token' });

    if ((search.promo || search.ob_plan) && !isVerifyingPath?.isExact) {
      dispatch(goToOnboarding());
    }
  } catch (err) {
    Sentry.error(err);

    await dispatch(resetSession());
  }
};

const setSession =
  ({ token, user, intercomUserHMAC }: { token: string; user: Models.Account; intercomUserHMAC: string | null }): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const tabID = tabIDSelector(state);
    const browserID = browserIDSelector(state);

    Cookies.removeLastSessionCookie();

    batch(() => {
      dispatch(updateAuthToken(token));
      dispatch(setIntercomUserHMAC(intercomUserHMAC));
      dispatch(updateAccount(user));
    });

    const location = locationSelector(state);
    const search = Query.parse(location.search);

    // Show join workspace onboarding on first login of an invite or with a workspace promo
    if ((search.invite && user.first_login) || search.promo || search.ob_plan) {
      dispatch(goToOnboarding());
    } else if (search.invite || !user.first_login) {
      dispatch(goToDashboardWithSearch(location.search));
    } else {
      dispatch(goToOnboarding());
    }

    await client.socket!.auth(token, browserID, tabID);

    await dispatch(identifyUser(user));
  };

export const ssoLogin =
  (payload: SSOLoginPayload): Thunk =>
  async (dispatch) => {
    const { user, token, intercomUserHMAC = null } = await client.sso.login(payload);

    await dispatch(setSession({ user, token, intercomUserHMAC }));
  };

const createSession =
  (sessionType: SessionType) =>
  (authRequest: unknown): Thunk<Models.Account> =>
  async (dispatch) => {
    const { user, token, intercomUserHMAC = null } = await client.session.create(sessionType, authRequest);

    await dispatch(setSession({ user, token, intercomUserHMAC }));

    return user;
  };

export const signup = createSession(SessionType.SIGN_UP);
export const basicAuthLogin = createSession(SessionType.BASIC_AUTH);
export const googleLogin = createSession(SessionType.GOOGLE);
export const facebookLogin = createSession(SessionType.FACEBOOK);

const createAdoptSSO =
  (sessionType: SessionType) =>
  (payload: SSOConvertPayload): Thunk<Models.Account> =>
  async (dispatch) => {
    const { user, token, intercomUserHMAC = null } = await client.sso.convert(sessionType, payload);

    await dispatch(setSession({ user, token, intercomUserHMAC }));

    return user;
  };

export const basicAuthAdoptSSO = createAdoptSSO(SessionType.BASIC_AUTH);
export const googleAdoptSSO = createAdoptSSO(SessionType.GOOGLE);
export const facebookAdoptSSO = createAdoptSSO(SessionType.FACEBOOK);
