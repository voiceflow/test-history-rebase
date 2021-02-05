/* eslint-disable import/prefer-default-export */
import { push } from 'connected-react-router';
import queryString from 'query-string';

import { Account } from '@/admin/client';
import { cookies } from '@/admin/store/utils';
import { SessionType } from '@/constants';
import { Thunk } from '@/store/types';
import * as Cookies from '@/utils/cookies';

import * as Actions from './actions';

export const checkSession = (): Thunk => async (dispatch) => {
  try {
    const user = await Account.getSession();

    dispatch(Actions.updateAccount(user));
  } catch (err) {
    Cookies.removeAuthCookie();

    dispatch(Actions.resetAccount());
  }
};

export const getUser = (): Thunk => async (dispatch) => {
  try {
    const user = await Account.getUser();

    dispatch(Actions.updateAccount(user));
  } catch (err) {
    Cookies.removeAuthCookie();

    dispatch(Actions.resetAccount());
  }
};

export const logout = (): Thunk => async (dispatch) => {
  try {
    await Account.logout();
  } catch (err) {
    console.error(err);
  }
  Cookies.removeAuthCookie();
  localStorage.clear();

  dispatch(Actions.resetAccount());
};

export const getVendors = (): Thunk => async (dispatch) => {
  try {
    const vendors = await Account.getVendors();

    if (Array.isArray(vendors)) {
      dispatch(Actions.UpdateVendors(vendors));
    }
  } catch (err) {
    console.error(err);
  }
};

const createSession = (sessionType: SessionType) => (authRequest: unknown): Thunk => async (dispatch, getState) => {
  const state = getState();

  try {
    const { user, token } = await Account.createSession(sessionType, authRequest);

    Cookies.setAuthCookie(token);
    Cookies.removeLastSessionCookie();

    dispatch(Actions.updateAccount(user));

    const location = state.router.location;
    const search = queryString.parse(location.search);

    // Ensure the user has admin credentials
    if ((user.admin ?? 0) < 100) {
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject('User is not an admin');
    }

    if (search.invite || !user?.first_login) {
      dispatch(
        push({
          pathname: '/admin',
          search: location.search,
          state: { from: location },
        })
      );
    } else {
      dispatch(push('/workspace/onboarding'));
    }

    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
};

export const signup = createSession(SessionType.SIGN_UP);
export const login = createSession(SessionType.BASIC_AUTH);
export const googleLogin = createSession(SessionType.GOOGLE);
export const fbLogin = createSession(SessionType.FACEBOOK);

// Non Action functions
export const getAuth = () => {
  return cookies.get(Cookies.AUTH_COOKIE);
};
