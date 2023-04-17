import { datadogRum } from '@datadog/browser-rum';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { parseQuery } from '@voiceflow/ui';
import { matchPath } from 'react-router-dom';

import client from '@/client';
import { SSOConvertPayload, SSOLoginPayload } from '@/client/sso';
import { CREATOR_APP_ENDPOINT } from '@/config';
import { Path } from '@/config/routes';
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
import { normalizeError } from '@/utils/error';
import * as QueryUtil from '@/utils/query';
import * as Support from '@/vendors/support';
import * as Userflow from '@/vendors/userflow';

import { setAuthToken } from './actions';
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

export const resetSession = (): SyncThunk => (dispatch) => {
  localStorage.clear();
  datadogRum.clearUser();

  dispatch(resetAccount());
  dispatch(updateAuthToken(null));

  dispatch(goToLogin(window.location.search));
};

export const logout = (): Thunk => async (dispatch, getState) => {
  const state = getState();
  const token = authTokenSelector(state);
  const isIdentityUserEnabled = Feature.isFeatureEnabledSelector(state)(Realtime.FeatureFlag.IDENTITY_USER);

  client.analytics.flush();

  if (token) {
    if (isIdentityUserEnabled) {
      await client.auth.revoke().catch(datadogRum.addError);
    } else {
      await client.session.delete().catch(datadogRum.addError);
    }
  }

  dispatch(resetSession());
};

export const identifyUser =
  (user: { name: string; email: string; creatorID: number; createdAt: string }, isSSO?: boolean): SyncThunk =>
  () => {
    const externalID = generateID(user.creatorID);

    Support.identify(user);
    Userflow.identify(externalID, user);
    datadogRum.setUser({
      id: user.creatorID?.toString(),
      email: user.email,
      name: user.name,
      isSSO,
    });
  };

export const getUserAccount =
  (): Thunk<{
    name: string;
    email: string;
    image: string | null;
    isSSO: boolean;
    verified: boolean;
    createdAt: string;
    creatorID: number;
  }> =>
  async (_dispatch, getState) => {
    const state = getState();
    const isIdentityUserEnabled = Feature.isFeatureEnabledSelector(state)(Realtime.FeatureFlag.IDENTITY_USER);

    if (isIdentityUserEnabled) {
      // using client.user.get() for now to get SSO related fields
      const [user, { gid, fid, okta_id, saml_provider_id }] = await Promise.all([client.identity.user.getSelf(), client.user.get()]);

      const isSSO = Boolean(gid || fid || okta_id || saml_provider_id);

      datadogRum.setUser({
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        isSSO,
      });

      return {
        ...user,
        isSSO,
        verified: user.emailVerified,
        creatorID: user.id,
      };
    }

    const { gid, fid, image = null, okta_id, creator_id, created, saml_provider_id, ...user } = await client.user.get();

    const isSSO = Boolean(gid || fid || okta_id || saml_provider_id);

    datadogRum.setUser({
      id: creator_id.toString(),
      email: user.email,
      name: user.name,
      isSSO,
    });

    return { ...user, image, isSSO, createdAt: created, creatorID: creator_id };
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

    if ((search.promo || search.ob_plan) && !isVerifyingPath?.isExact) {
      dispatch(goToOnboarding());
    }
  } catch (err) {
    datadogRum.addError(err);

    dispatch(resetSession());
  }
};

interface SetSessionOptions {
  user: Models.Account;
  token: string;
  redirectTo?: string;
  isSSO?: boolean;
}

const setSession =
  ({ user, token, redirectTo, isSSO }: SetSessionOptions): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();

    Cookies.removeLastSessionCookie();

    dispatch(updateAuthToken(token));
    dispatch(updateAccount(user));

    const location = locationSelector(state);
    const search = QueryUtil.parse(location.search);

    dispatch(identifyUser({ ...user, createdAt: user.created, creatorID: user.creator_id }, isSSO));

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
  };

export const ssoLogin =
  (payload: SSOLoginPayload): Thunk =>
  async (dispatch) => {
    const parsedQuery = parseQuery(window.location.search);

    const { user, token } = await client.sso.login(payload, parsedQuery);

    dispatch(setSession({ user, token, isSSO: true }));
  };

interface SessionOptions {
  query?: Record<string, string>;
  redirectTo?: string;
  firstLogin?: boolean;
}

const createSession =
  (sessionType: SessionType) =>
  (authRequest: unknown, { query, redirectTo, firstLogin }: SessionOptions = {}): Thunk<Models.Account> =>
  async (dispatch) => {
    const parsedQuery = { ...parseQuery(window.location.search), ...query };
    const { user, token } = await client.session.create(sessionType, authRequest, parsedQuery);

    const isSSO = [SessionType.GOOGLE, SessionType.FACEBOOK].includes(sessionType);
    dispatch(setSession({ user: { ...user, first_login: firstLogin ?? user.first_login }, token, redirectTo, isSSO }));

    return user;
  };

const legacySignup = createSession(SessionType.SIGN_UP);
export const legacyGoogleLogin = createSession(SessionType.GOOGLE);
export const legacyFacebookLogin = createSession(SessionType.FACEBOOK);
export const legacyBasicAuthLogin = createSession(SessionType.BASIC_AUTH);

const createAdoptSSO =
  (sessionType: SessionType) =>
  (payload: SSOConvertPayload): Thunk<Models.Account> =>
  async (dispatch) => {
    const { user, token } = await client.sso.convert(sessionType, payload);

    dispatch(setSession({ user, token, isSSO: true }));

    return user;
  };

export const googleAdoptSSO = createAdoptSSO(SessionType.GOOGLE);
export const facebookAdoptSSO = createAdoptSSO(SessionType.FACEBOOK);
export const basicAuthAdoptSSO = createAdoptSSO(SessionType.BASIC_AUTH);

interface SigninPayload {
  email: string;
  password: string;
}

export const signin =
  (payload: SigninPayload, options: SessionOptions = {}): Thunk<Models.Account> =>
  async (dispatch, getState) => {
    const isIdentityUserEnabled = Feature.isFeatureEnabledSelector(getState())(Realtime.FeatureFlag.IDENTITY_USER);

    if (isIdentityUserEnabled) {
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
    }

    return dispatch(legacyBasicAuthLogin(payload, options));
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

    dispatch(setSession({ user, token, redirectTo: options?.redirectTo, isSSO: true }));
  };

interface SignupPayload {
  email: string;
  query: Query.Auth;
  coupon: string;
  password: string;
  lastName: string;
  firstName: string;
}

export const signup =
  ({ email, query, coupon, password, lastName, firstName }: SignupPayload): Thunk<{ creatorID: number; email: string }> =>
  async (dispatch, getState) => {
    const isIdentityUserEnabled = Feature.isFeatureEnabledSelector(getState())(Realtime.FeatureFlag.IDENTITY_USER);

    const userName = `${firstName} ${lastName}`.trim();

    if (isIdentityUserEnabled) {
      const user = await client.identity.user.create({
        user: { name: userName, email },
        password,
        metadata: {
          utm: { utm_last_name: lastName, utm_first_name: firstName },
          promoCode: coupon,
          inviteParams: query,
        },
      });

      await dispatch(signin({ email, password }, { query, firstLogin: true }));

      return {
        creatorID: user.id,
        email: user.email,
      };
    }

    try {
      const user = await dispatch(
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

      return {
        creatorID: user.creator_id,
        email: user.email,
      };
    } catch (error) {
      throw normalizeError(error);
    }
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
  async (_dispatch, getState) => {
    const isIdentityUserEnabled = Feature.isFeatureEnabledSelector(getState())(Realtime.FeatureFlag.IDENTITY_USER);

    if (!Utils.emails.isValidEmail(email)) return null;

    if (isIdentityUserEnabled) {
      return client.auth.v1.sso
        .getSaml2LoginURL(email, `${CREATOR_APP_ENDPOINT}${Path.LOGIN_SSO_CALLBACK}${window.location.search}`)
        .catch(() => null);
    }

    const domain = Utils.emails.getEmailDomain(email);
    const organizationID = await client.organization.checkDomain(domain);

    if (!organizationID) return null;

    const { entryPoint } = await client.organization.getSAMLLogin(organizationID);

    return entryPoint;
  };
