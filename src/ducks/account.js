import axios from 'axios';
import { push } from 'connected-react-router';
import update from 'immutability-helper';
import LogRocket from 'logrocket';
import queryString from 'query-string';
import { IntercomAPI } from 'react-intercom';

import { getDevice } from '@/Helper';
import { LOGROCKET_ENABLED } from '@/config';
import { setError } from '@/ducks/modal';

import { getAuthCookie, removeAuthCookie, removeLastSessionCookie, setAuthCookie } from '../cookies';

export const UPDATE_ACCOUNT = 'UPDATE_ACCOUNT';
export const UPDATE_AMAZON_ACCOUNT = 'UPDATE_AMAZON_ACCOUNT';
export const UPDATE_GOOGLE_ACCOUNT = 'UPDATE_GOOGLE_ACCOUNT';
export const RESET_ACCOUNT = 'RESET_ACCOUNT';

const initialState = {
  loading: false,
  email: null,
  name: null,
  creator_id: null,
  admin: 0,
  image: null,
  amazon: null,
  google: null,
};

// REDUCER
export default function accountReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_GOOGLE_ACCOUNT:
      if (!state.google) return state;
      return update(state, { google: { $merge: action.payload } });
    case UPDATE_AMAZON_ACCOUNT:
      if (!state.amazon) return state;
      return update(state, { amazon: { $merge: action.payload } });
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

export const updateAmazonAccount = (payload) => ({
  type: UPDATE_AMAZON_ACCOUNT,
  payload,
});

export const updateGoogleAccount = (payload) => ({
  type: UPDATE_GOOGLE_ACCOUNT,
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

      identifyLogRocket(user);

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

export const getVendors = () => async (dispatch, getState) => {
  try {
    if (!getState().account.amazon) return;
    const vendors = (await axios.get('/session/vendor?all=true')).data;
    if (Array.isArray(vendors)) {
      dispatch(
        updateAmazonAccount({
          vendors,
        })
      );
    }
  } catch (err) {
    console.error(err);
  }
};

const createSession = (endpoint) => (user) => async (dispatch, getState) => {
  try {
    const data = (await axios.put(endpoint, { user, device: getDevice() })).data;
    if (data.user.id) {
      data.user.creator_id = data.user.id;
      delete data.user.id;
    }

    setAuthCookie(data.token);
    removeLastSessionCookie();

    dispatch(updateAccount(data.user));

    const location = getState().router.location;
    const search = queryString.parse(location.search);

    if (search.invite || !data.user.first_login) {
      dispatch(
        push({
          pathname: '/dashboard',
          search: location.search,
          state: { from: location },
        })
      );
    } else {
      localStorage.setItem('is_first_upload', 'true');
      localStorage.setItem('is_first_session', 'true');
      dispatch(push('/onboarding'));
    }

    identifyLogRocket(data.user);

    if (window.Appcues) {
      window.Appcues.identify(data.user.creator_id, {
        email: user.email,
        name: user.name,
      });
    }

    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
};

export const signup = createSession('/user');
export const login = createSession('/session');
export const googleLogin = createSession('/googleLogin');
export const fbLogin = createSession('/fbLogin');

// Non Action functions
export const getAuth = getAuthCookie;

export const createAmazonSession = (code) => async (dispatch) => {
  try {
    const { data: amazon } = (await axios.get(`/session/amazon/${code}`)) || null;
    dispatch(updateAccount({ amazon }));
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const checkAmazonAccount = () => async (dispatch) => {
  let amazon = null;
  try {
    amazon = (await axios.get('/session/amazon/access_token')).data || null;
  } catch (err) {
    console.error(err);
  }
  dispatch(updateAccount({ amazon }));
};

export const deleteAmazonAccount = () => async (dispatch) => {
  try {
    await axios.delete('/session/amazon');
    dispatch(updateAccount({ amazon: null }));
  } catch (err) {
    dispatch(setError('Something went wrong - please refresh your page'));
  }
};

export const checkGoogleAccount = () => async (dispatch) => {
  let google = null;
  try {
    google = (await axios.get('/session/google/access_token')).data || null;
  } catch (err) {
    console.error(err);
  }
  dispatch(updateAccount({ google }));
};

export const deleteGoogleAccount = () => async (dispatch) => {
  try {
    await axios.delete('/session/google/access_token');
    dispatch(updateAccount({ google: null }));
  } catch (err) {
    dispatch(setError('Something went wrong - please refresh your page'));
  }
};

export const dialogflowToken = (projectId) =>
  new Promise((resolve, reject) => {
    axios
      .get(`/session/google/dialogflow_access_token/${projectId}`)
      .then((res) => resolve(!!(res.data && res.data.token)))
      .catch((err) => reject(err));
  });

export const verifyGoogleToken = (token) =>
  new Promise((resolve, reject) => {
    axios
      .post('/session/google/verify_token', { token })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });

export function identifyLogRocket(user) {
  if (LOGROCKET_ENABLED) {
    LogRocket.identify(user.creator_id, {
      email: user.email,
      name: user.name,
    });

    // add session URL to intercom timeline
    LogRocket.getSessionURL((sessionURL) => IntercomAPI('trackEvent', 'LogRocket', { sessionURL }));
  }
}
