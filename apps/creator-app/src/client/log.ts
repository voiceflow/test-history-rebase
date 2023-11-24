import { datadogRum } from '@datadog/browser-rum';
import { GLOBAL_FETCH_HEADERS, IS_E2E, LOGROCKET_ENABLED } from '@voiceflow/ui';
import axios from 'axios';

import { DATADOG_SITE, LOGROCKET_PROJECT } from '@/config';
import * as Session from '@/ducks/session';
import * as DatadogRUMVendor from '@/vendors/datadogRUM';
import * as LogRocket from '@/vendors/logrocket';

const initializeLogRocket = () => {
  LogRocket.initialize({
    project: LOGROCKET_PROJECT,
    callback: (sessionURL) => {
      // add session URL to all outgoing HTTP requests
      axios.defaults.headers.common['x-logrocket-url'] = sessionURL;
      GLOBAL_FETCH_HEADERS.set('x-logrocket-url', sessionURL);
    },
    sessionRequestSanitizers: [
      {
        matcher: { method: 'PUT', route: ['/session', '/user'] },
        transform: (body: { user: { password: string } }) => ({ ...body, user: { ...body.user, password: LogRocket.REDACTED } }),
      },
      {
        matcher: { method: 'PUT', route: '/googleLogin' },
        transform: (body: { user: { token: string } }) => ({ ...body, user: { ...body.user, token: LogRocket.REDACTED } }),
      },
      {
        matcher: { method: 'PUT', route: '/fbLogin' },
        transform: (body: { user: { token: string } }) => ({ ...body, user: { ...body.user, token: LogRocket.REDACTED } }),
      },
      {
        matcher: { method: 'POST', route: '/v2/sso/login' },
        transform: (body: { code: string }) => ({ ...body, code: LogRocket.REDACTED }),
      },
    ],
  });
};

const initializeDatadog = () => {
  if (!IS_E2E) {
    DatadogRUMVendor.initialize();
  }
};

const initialize = (): void => {
  if (LOGROCKET_ENABLED) {
    initializeLogRocket();
  } else {
    initializeDatadog();
  }
};

const error = (...props: any[]): void => {
  if (LOGROCKET_ENABLED) {
    LogRocket.error(props);
  } else {
    datadogRum.addError(props);
  }
};

const captureException = (error: Error, errorInfo: React.ErrorInfo): void => {
  if (LOGROCKET_ENABLED) {
    LogRocket.captureException(error, {
      extra: {
        stack: errorInfo.componentStack,
      },
    });
  } else {
    datadogRum.addError(error, errorInfo);
  }
};

const identify = (id: string, user: { email: string; name: string; creatorID?: number }): void => {
  if (LOGROCKET_ENABLED) {
    LogRocket.identify(id, user);
  } else {
    datadogRum.setUser({
      id: user.creatorID?.toString(),
      email: user.email,
      name: user.name,
    });
  }
};

const middleware = () =>
  LogRocket.reduxMiddleware({
    stateSanitizer: (state) => ({
      ...state,
      session: {
        ...state.session,
        token: { value: LogRocket.REDACTED },
      },
    }),
    actionSanitizer: (action) =>
      action.type === Session.SessionAction.SET_AUTH_TOKEN
        ? {
            ...action,
            payload: LogRocket.REDACTED,
          }
        : action,
  });

const getSessionURL = (callback: (sessionURL: string | undefined) => void): void => {
  if (LOGROCKET_ENABLED) {
    return LogRocket.getSessionURL(callback);
  }

  const context = datadogRum.getInternalContext();
  const sessionURL = context ? `https://app.${DATADOG_SITE}/rum/replay/sessions/${context.session_id}` : undefined;

  return callback(sessionURL);
};

const clearUser = (): void => {
  if (!LOGROCKET_ENABLED) {
    datadogRum.clearUser();
  }
};

const setUserProperty = (key: string, value: string | number | boolean): void => {
  if (!LOGROCKET_ENABLED) {
    datadogRum.setUserProperty(key, value);
  }
};

const removeUserProperty = (key: string): void => {
  if (!LOGROCKET_ENABLED) {
    datadogRum.removeUserProperty(key);
  }
};

const logClient = {
  captureException,
  getSessionURL,
  initialize,
  middleware,
  identify,
  error,

  /**
   * @deprecated DataDog is being deprecated in favor of LogRocket, removeUserProperty is not supported
   */
  removeUserProperty,
  /**
   * @deprecated DataDog is being deprecated in favor of LogRocket, setUserProperty is not supported
   */
  setUserProperty,
  /**
   * @deprecated DataDog is being deprecated in favor of LogRocket, clearUser is not supported
   */
  clearUser,
};

export default logClient;
