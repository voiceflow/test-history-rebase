import { GLOBAL_FETCH_HEADERS, IS_E2E, IS_SAFARI, setUnauthorizedHandler, StatusCode, toast } from '@voiceflow/ui';
import axios from 'axios';
import { History } from 'history';
import { setAutoFreeze } from 'immer';
import _throttle from 'lodash/throttle';

import client from './client';
import { API_ENDPOINT, TRUSTED_ENDPOINTS, VERSION } from './config';
import { clearPersistedLogs } from './utils/logger';
import * as DatadogRUM from './vendors/datadogRUM';
import * as Google from './vendors/google';
import * as GoogleAnalytics from './vendors/googleAnalytics';
import * as Userflow from './vendors/userflow';
import VoiceflowAssistant from './vendors/voiceflowAssistant';

const LOGOUT_HANDLER_TIMEOUT = 3000;

const VOICEFLOW_ASCII = String.raw`
            _           __ _
/\   /\___ (_) ___ ___ / _| | _____      __
\ \ / / _ \| |/ __/ _ \ |_| |/ _ \ \ /\ / /
 \ V / (_) | | (_|  __/  _| | (_) \ V  V /
  \_/ \___/|_|\___\___|_| |_|\___/ \_/\_/
`;

const setupApp = ({ tabID, logout, history, browserID }: { tabID: string; logout: () => void; history: History; browserID: string }) => {
  // disable immer freezing
  setAutoFreeze(false);

  clearPersistedLogs();

  const logoutHandler = _throttle(
    async (endpoint: string) => {
      if (TRUSTED_ENDPOINTS.includes(endpoint)) {
        try {
          await client.identity.user.getSelf();
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

  GLOBAL_FETCH_HEADERS.set('browserid', browserID);
  GLOBAL_FETCH_HEADERS.set('tabid', tabID);

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === StatusCode.UNAUTHORIZED) {
        await logoutHandler(error.config.baseURL);
      }

      throw error;
    }
  );

  client.api.fetch.setOptions({ headers: { tabid: tabID, browserid: browserID } });

  if (!IS_E2E) {
    DatadogRUM.initialize();
  }

  Google.initialize();

  GoogleAnalytics.initialize(history);

  Userflow.initialize();

  VoiceflowAssistant.initialize();

  // eslint-disable-next-line no-console
  console.info(
    // safari doesn't use a monospaced font in its console so the ASCII art looks trash
    IS_SAFARI
      ? `%cVoiceflow ${VERSION}`
      : `%c
${VOICEFLOW_ASCII}

${VERSION}
  `,
    'color: grey'
  );
};

export default setupApp;
