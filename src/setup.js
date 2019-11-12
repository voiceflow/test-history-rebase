import axios from 'axios';
import ReactGA from 'react-ga';

import { GLOBAL_HEADERS } from '@/client/fetch';
import { API_ENDPOINT, GA_ENABLED, GOOGLE_ANALYTICS_ID, VERSION } from '@/config';
import { initializeLogRocket } from '@/vendors/logRocket';

const setupApp = (history, tabID) => {
  axios.defaults.baseURL = API_ENDPOINT;
  axios.defaults.withCredentials = true;
  axios.defaults.crossDomain = true;
  axios.defaults.headers.common.tabid = tabID;
  GLOBAL_HEADERS.set('tabid', tabID);

  initializeLogRocket((sessionURL) => {
    // add session URL to all outgoing HTTP requests
    axios.defaults.headers.common['X-LogRocket-URL'] = sessionURL;
    GLOBAL_HEADERS.set('X-LogRocket-URL', sessionURL);
  });

  if (GA_ENABLED) {
    ReactGA.initialize(GOOGLE_ANALYTICS_ID);

    // report pageview events
    // TODO: should probably replace this with redux-beacon
    history.listen((location) => {
      ReactGA.set({ page: location.pathname });
      ReactGA.pageview(location.pathname);
    });
  }

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
