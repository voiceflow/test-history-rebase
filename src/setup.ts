import axios from 'axios';
import { History } from 'history';

import { GLOBAL_HEADERS } from './client/fetch';
import { API_ENDPOINT, VERSION } from './config';
import * as GoogleAnalytics from './vendors/googleAnalytics';
import * as LogRocket from './vendors/logRocket';
import * as Userflow from './vendors/userflow';

const setupApp = (history: History, browserID: string, tabID: string) => {
  axios.defaults.baseURL = API_ENDPOINT;
  axios.defaults.withCredentials = true;
  axios.defaults.headers.common.browserid = browserID;
  axios.defaults.headers.common.tabid = tabID;
  GLOBAL_HEADERS.set('browserid', browserID);
  GLOBAL_HEADERS.set('tabid', tabID);

  LogRocket.initialize((sessionURL) => {
    // add session URL to all outgoing HTTP requests
    axios.defaults.headers.common['x-logrocket-url'] = sessionURL;
    GLOBAL_HEADERS.set('x-logrocket-url', sessionURL);
  });

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
