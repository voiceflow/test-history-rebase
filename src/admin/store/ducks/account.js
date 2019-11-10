import axios from 'axios';
import { push } from 'connected-react-router';
import queryString from 'query-string';
import Cookies from 'universal-cookie';

import { AUTH_COOKIE, removeAuthCookie, removeLastSessionCookie, setAuthCookie } from '@/utils/cookies';

const cookies = new Cookies();

export const UPDATE_ACCOUNT = 'UPDATE_ACCOUNT';
export const RESET_ACCOUNT = 'RESET_ACCOUNT';

const initialState = {
  loading: false,
  email: null,
  name: null,
  creator_id: null,
  admin: 0,
  image: null,
  vendors: [],
};

// REDUCER
export default function accountReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_ACCOUNT:
      return {
        ...state,
        ...action.payload,
      };
    case RESET_ACCOUNT:
      return initialState;
    default:
      return state;
  }
}

// ACTIONS
const resetAccount = () => ({
  type: RESET_ACCOUNT,
});

export const updateAccount = (payload) => ({
  type: UPDATE_ACCOUNT,
  payload,
});

export const checkSession = () => {
  return async (dispatch) => {
    try {
      const user = (await axios.get('/session')).data;
      dispatch(updateAccount(user));
      return Promise.resolve(user);
    } catch (err) {
      removeAuthCookie();
      dispatch(resetAccount());
      return Promise.reject(err);
    }
  };
};

export const getUser = () => {
  return async (dispatch) => {
    try {
      const user = (await axios.get('/user')).data;
      dispatch(updateAccount(user));

      return Promise.resolve(user);
    } catch (err) {
      removeAuthCookie();
      dispatch(resetAccount());
      return Promise.reject(err);
    }
  };
};

export const logout = () => {
  return async (dispatch) => {
    try {
      await axios.delete('/session');
    } catch (err) {
      console.error(err);
    }
    removeAuthCookie();
    localStorage.clear();
    dispatch(resetAccount());

    return Promise.resolve();
  };
};

export const getVendors = () => {
  return async (dispatch) => {
    try {
      const vendors = (await axios.get('/session/vendor?all=true')).data;
      if (Array.isArray(vendors)) {
        dispatch(
          updateAccount({
            vendors,
          })
        );
      }
    } catch (err) {
      console.error(err);
    }
    Promise.resolve();
  };
};

const createSession = (endpoint) => {
  return (user) => {
    return async (dispatch, getState) => {
      try {
        const data = (await axios.put(endpoint, { user })).data;
        if (data.user.id) {
          data.user.creator_id = data.user.id;
          delete data.user.id;
        }

        setAuthCookie(data.token);
        removeLastSessionCookie();

        dispatch(updateAccount(data.user));

        const location = getState().router.location;
        const search = queryString.parse(location.search);

        // Ensure the user has admin credentials
        if (data.user.admin < 100) {
          // eslint-disable-next-line prefer-promise-reject-errors
          return Promise.reject('User is not an admin');
        }

        if (search.invite || !data.user.first_login) {
          dispatch(
            push({
              pathname: '/admin',
              search: location.search,
              state: { from: location },
            })
          );
        } else {
          localStorage.setItem('is_first_upload', 'true');
          localStorage.setItem('is_first_session', 'true');
          dispatch(push('/team/onboarding'));
        }

        return Promise.resolve();
      } catch (err) {
        return Promise.reject(err);
      }
    };
  };
};

export const signup = createSession('/user');
export const login = createSession('/session');
export const googleLogin = createSession('/googleLogin');
export const fbLogin = createSession('/fbLogin');

// Non Action functions
export const getAuth = () => {
  return cookies.get(AUTH_COOKIE);
};
