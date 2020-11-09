import axios from 'axios';
import { History } from 'history';
import _throttle from 'lodash/throttle';

import { toast } from '@/components/Toast';

import fetch, { GLOBAL_HEADERS, StatusCode } from './client/fetch';
import { setUnauthorizedHandler } from './client/fetch/raw';
import voiceflowAPI from './clientV2/api';
import { API_ENDPOINT, TRUSTED_ENDPOINTS, VERSION } from './config';
import { clearPersistedLogs } from './utils/logger';
import * as Google from './vendors/google';
import * as GoogleAnalytics from './vendors/googleAnalytics';
import * as LogRocket from './vendors/logRocket';
import * as Userflow from './vendors/userflow';

const LOGOUT_HANDLER_TIMEOUT = 3000;

const setupApp = ({ tabID, logout, history, browserID }: { tabID: string; logout: () => void; history: History; browserID: string }) => {
  clearPersistedLogs();

  const logoutHandler = _throttle(
    async (endpoint: string) => {
      if (TRUSTED_ENDPOINTS.includes(endpoint)) {
        try {
          await fetch.get('session', { unauthorizedInterceptor: false });
        } catch (err) {
          toast.info('You have been logged out due to inactivity or another open instance');
          logout();
        }
      }
    },
    LOGOUT_HANDLER_TIMEOUT,
    { trailing: false }
  );

  setUnauthorizedHandler(logoutHandler);

  axios.defaults.baseURL = API_ENDPOINT;
  axios.defaults.withCredentials = true;
  axios.defaults.headers.common.browserid = browserID;
  axios.defaults.headers.common.tabid = tabID;
  GLOBAL_HEADERS.set('browserid', browserID);
  GLOBAL_HEADERS.set('tabid', tabID);

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      if (error.response?.status === StatusCode.UNAUTHORIZED) {
        await logoutHandler(error.config.baseURL);
      }

      throw error;
    }
  );

  voiceflowAPI.fetch.setOptions({
    headers: {
      browserid: browserID,
      tabid: tabID,
    },
  });

  LogRocket.initialize((sessionURL) => {
    // add session URL to all outgoing HTTP requests
    axios.defaults.headers.common['x-logrocket-url'] = sessionURL;
    GLOBAL_HEADERS.set('x-logrocket-url', sessionURL);
  });

  Google.initialize();

  GoogleAnalytics.initialize(history);

  Userflow.initialize();

  // eslint-disable-next-line no-console
  console.info(
    `%c
            _           __ _
/\\   /\\___ (_) ___ ___ / _| | _____      __
\\ \\ / / _ \\| |/ __/ _ \\ |_| |/ _ \\ \\ /\\ / /
 \\ V / (_) | | (_|  __/  _| | (_) \\ V  V /
  \\_/ \\___/|_|\\___\\___|_| |_|\\___/ \\_/\\_/

${VERSION}
  `,
    'color: grey'
  );
};

export default setupApp;
