import * as Realtime from '@voiceflow/realtime-sdk';
import { parseQuery, Vendors } from '@voiceflow/ui';
import { batch } from 'react-redux';
import { matchPath } from 'react-router-dom';

import client from '@/client';
import { SSOConvertPayload, SSOLoginPayload } from '@/client/sso';
import { SessionType } from '@/constants';
import { resetAccount, updateAccount } from '@/ducks/account/actions';
import * as Feature from '@/ducks/feature';
import { goTo, goToDashboardWithSearch, goToLogin, goToOnboarding } from '@/ducks/router/actions';
import { locationSelector } from '@/ducks/router/selectors';
import * as Models from '@/models';
import { Query } from '@/models';
import { SyncThunk, Thunk } from '@/store/types';
import * as Cookies from '@/utils/cookies';
import { generateID } from '@/utils/env';
import * as QueryUtil from '@/utils/query';
import * as Sentry from '@/vendors/sentry';
import * as Support from '@/vendors/support';
import * as Userflow from '@/vendors/userflow';

import { setAuthToken, setIntercomUserHMAC } from './actions';
import { authTokenSelector } from './selectors';

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
  (user: Models.Account): Thunk =>
  async () => {
    // eslint-disable-next-line camelcase
    const { creator_id, ...userWithoutID } = user;
    const externalID = generateID(creator_id);

    Vendors.LogRocket.identify(externalID, userWithoutID);
    Support.identify(user);
    Userflow.identify(externalID, user);
  };

export const restoreSession = (): Thunk => async (dispatch, getState) => {
  try {
    const state = getState();
    const token = authTokenSelector(state);
    const user = await client.user.get();

    if (!token) throw new Error('no auth token set');

    dispatch(updateAccount(user));

    await dispatch(identifyUser(user));

    const location = locationSelector(state);
    const search = QueryUtil.parse(location.search);
    const isVerifyingPath = matchPath(location.pathname, { path: '/account/confirm/:token' });
    if ((search.promo || search.ob_plan) && !isVerifyingPath?.isExact) {
      dispatch(goToOnboarding());
    }
  } catch (err) {
    Sentry.error(err);

    await dispatch(resetSession());
  }
};

interface SetSessionOptions {
  user: Models.Account;
  token: string;
  redirectTo?: string;
  intercomUserHMAC: string | null;
}

const setSession =
  ({ user, token, redirectTo, intercomUserHMAC }: SetSessionOptions): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    Cookies.removeLastSessionCookie();

    batch(() => {
      dispatch(updateAuthToken(token));
      dispatch(setIntercomUserHMAC(intercomUserHMAC));
      dispatch(updateAccount(user));
    });

    const location = locationSelector(state);
    const search = QueryUtil.parse(location.search);

    if (redirectTo) {
      dispatch(goTo(redirectTo));
      // Show join workspace onboarding on first login of an invite or with a workspace promo
    } else if ((search.invite && user.first_login) || search.promo || search.ob_plan) {
      dispatch(goToOnboarding());
    } else if (search.invite || !user.first_login) {
      dispatch(goToDashboardWithSearch(location.search));
    } else {
      dispatch(goToOnboarding());
    }

    await dispatch(identifyUser(user));
  };

export const ssoLogin =
  (payload: SSOLoginPayload): Thunk =>
  async (dispatch) => {
    const parsedQuery = parseQuery(window.location.search);

    const { user, token, intercomUserHMAC = null } = await client.sso.login(payload, parsedQuery);

    await dispatch(setSession({ user, token, intercomUserHMAC }));
  };

const createSession =
  (sessionType: SessionType) =>
  (
    authRequest: unknown,
    { query, redirectTo, firstLogin }: { query?: Record<string, string>; redirectTo?: string; firstLogin?: boolean } = {}
  ): Thunk<Models.Account> =>
  async (dispatch) => {
    const parsedQuery = { ...parseQuery(window.location.search), ...query };
    const { user, token, intercomUserHMAC = null } = await client.session.create(sessionType, authRequest, parsedQuery);

    await dispatch(setSession({ user: { ...user, first_login: firstLogin ?? user.first_login }, token, redirectTo, intercomUserHMAC }));

    return user;
  };

const legacySignup = createSession(SessionType.SIGN_UP);
export const googleLogin = createSession(SessionType.GOOGLE);
export const facebookLogin = createSession(SessionType.FACEBOOK);
export const basicAuthLogin = createSession(SessionType.BASIC_AUTH);

const createAdoptSSO =
  (sessionType: SessionType) =>
  (payload: SSOConvertPayload): Thunk<Models.Account> =>
  async (dispatch) => {
    const { user, token, intercomUserHMAC = null } = await client.sso.convert(sessionType, payload);

    await dispatch(setSession({ user, token, intercomUserHMAC }));

    return user;
  };

export const googleAdoptSSO = createAdoptSSO(SessionType.GOOGLE);
export const facebookAdoptSSO = createAdoptSSO(SessionType.FACEBOOK);
export const basicAuthAdoptSSO = createAdoptSSO(SessionType.BASIC_AUTH);

interface SignupPayload {
  email: string;
  query: Query.Auth;
  coupon: string;
  password: string;
  lastName: string;
  firstName: string;
}

export const signup =
  ({ email, query, coupon, password, lastName, firstName }: SignupPayload): Thunk<void> =>
  async (dispatch, getState) => {
    const isIdentityUserEnabled = Feature.isFeatureEnabledSelector(getState())(Realtime.FeatureFlag.IDENTITY_USER);

    const userName = `${firstName} ${lastName}`.trim();

    if (isIdentityUserEnabled) {
      await client.identity.user.create({
        user: { name: userName, email },
        password,
        metadata: {
          utm: { utm_last_name: lastName, utm_first_name: firstName },
          promoCode: coupon,
          inviteParams: query,
        },
      });

      await dispatch(basicAuthLogin({ email, password }, { query, firstLogin: true }));

      return;
    }

    try {
      await dispatch(
        legacySignup(
          {
            name: userName,
            email,
            coupon: coupon.toLowerCase(),
            password,
            urlSearch: QueryUtil.stringify(query),
            referralCode: query.referral,
            referralRockCode: query.ref_code,
          },
          { query: { utm_last_name: lastName, utm_first_name: firstName } }
        )
      );
    } catch (error) {
      throw new Error(error.body.data);
    }
  };
