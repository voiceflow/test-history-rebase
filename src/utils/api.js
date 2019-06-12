import axios from 'axios';
import config from 'config';
import { push } from 'connected-react-router';
import { LOGOUT_USER } from 'containers/App/constants';
import { NOTIFICATIONS_SHOW_ERROR, NOTIFICATIONS_SHOW_SUCCESS } from 'containers/Notifications/constants';
import Raven from 'raven-js';
import Storage from 'utils/storage';

const axiosApi = axios.create({
  baseURL: `${config.apiUrl}/`,
  timeout: 35000,
});

const request = (options, headers = {}, { anonymous } = {}) =>
  axiosApi.request({
    ...options,
    method: options.method || 'get',
    headers: {
      ...headers,
      Authorization: anonymous ? null : `Bearer ${Storage.get('token')}`,
    },
  });

export const getUrl = (path) => `${config.apiUrl}/${path}`;

export const clearUserInfo = () => {
  Storage.remove('token');

  if (process.env.NODE_ENV === 'production') {
    Raven.setUserContext();

    // eslint-disable-next-line no-unused-expressions
    window.Intercom && window.Intercom('shutdown');
  }
};

export const requestProcessorCreator = ({ unauthorizedErrorMessage } = {}) => ({
  after,
  before,
  headers,
  anonymous,
  throwOnFail,
  errorMessage = 'Something went wrong.',
  successMessage,
  successChecker,
  errorResponseKey = 'message',
  disableErrorPostfix,
  disableErrorMessage,
  ...requestOptions
} = {}) => (successCallback, errorCallback) => async (dispatch, getState) => {
  const stateBeforeUpdate = getState();

  try {
    if (typeof before === 'function') {
      before(dispatch, getState, stateBeforeUpdate);
    }

    const response = await request(requestOptions, headers, { anonymous });

    if (typeof successChecker === 'function') {
      const isSuccess = await successChecker(response);

      if (!isSuccess) {
        throw response;
      }
    }

    if (successMessage) {
      dispatch({ type: NOTIFICATIONS_SHOW_SUCCESS, text: successMessage });
    }

    if (successCallback) {
      successCallback(dispatch, getState, stateBeforeUpdate)(response);
    }

    return response;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('api-error', err);

    if (!err.response || err.response.status >= 500) {
      dispatch(push('/500'));
    } else if (err.response.status === 403) {
      if (unauthorizedErrorMessage) {
        dispatch({ type: NOTIFICATIONS_SHOW_ERROR, text: unauthorizedErrorMessage });
      }

      dispatch(push('/'));
    } else if (err.response.status === 401) {
      clearUserInfo();

      dispatch({ type: LOGOUT_USER });

      dispatch(push('/sign-in'));
    } else if (!disableErrorMessage) {
      let responseError = '';
      let errorPostfix = disableErrorPostfix ? '' : 'Please contact the Invocable team.';

      if (errorResponseKey && err.response && err.response.data && err.response.data[errorResponseKey]) {
        const error = err.response.data[errorResponseKey];

        errorPostfix = '';
        responseError = Array.isArray(error) ? error.join('\n ') : error;
      }

      dispatch({
        type: NOTIFICATIONS_SHOW_ERROR,
        text: `${responseError || errorMessage} ${errorPostfix}`,
      });
    }

    if (errorCallback) {
      errorCallback(dispatch, getState, stateBeforeUpdate)(err);
    }

    if (throwOnFail) {
      throw err.response;
    }

    return null;
  } finally {
    // eslint-disable-next-line no-unused-expressions
    after && after(dispatch, getState, stateBeforeUpdate);
  }
};

export default request;
