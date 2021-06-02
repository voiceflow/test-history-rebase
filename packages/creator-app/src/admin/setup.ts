import axios from 'axios';
import cuid from 'cuid';

import setupSocket from '@/admin/client/socket';
import client from '@/client';
import { GLOBAL_HEADERS } from '@/client/fetch';
import { API_ENDPOINT, VERSION } from '@/config';
import { clearPersistedLogs } from '@/utils/logger';
import * as LogRocket from '@/vendors/logRocket';

const TAB_ID_KEY = 'tabId';

const setupAdmin = () => {
  clearPersistedLogs();

  if (!sessionStorage.getItem(TAB_ID_KEY)) {
    sessionStorage.setItem(TAB_ID_KEY, cuid());
  }

  const tabID = sessionStorage.getItem(TAB_ID_KEY)!;

  axios.defaults.baseURL = API_ENDPOINT;
  axios.defaults.withCredentials = true;
  axios.defaults.headers.common.tabid = tabID;
  GLOBAL_HEADERS.set('tabid', tabID);

  client.api.fetch.setOptions({
    headers: {
      tabid: tabID,
    },
  });

  LogRocket.initialize((sessionURL) => {
    // add session URL to all outgoing HTTP requests
    axios.defaults.headers.common['x-logrocket-url'] = sessionURL;
    GLOBAL_HEADERS.set('x-logrocket-url', sessionURL);
  });

  setupSocket(tabID);

  // eslint-disable-next-line no-console
  console.info(
    `%c
            _           __ _                __ _       _           _     __
/\\   /\\___ (_) ___ ___ / _| | _____      __/ //_\\   __| |_ __ ___ (_)_ __\\ \\
\\ \\ / / _ \\| |/ __/ _ \\ |_| |/ _ \\ \\ /\\ / / |//_\\\\ / _\` | '_ \` _ \\| | '_ \\| |
 \\ V / (_) | | (_|  __/  _| | (_) \\ V  V /| /  _  \\ (_| | | | | | | | | | | |
  \\_/ \\___/|_|\\___\\___|_| |_|\\___/ \\_/\\_/ | \\_/ \\_/\\__,_|_| |_| |_|_|_| |_| |
                                           \\_\\                           /_/

${VERSION}
  `,
    'color: grey'
  );
};

export default setupAdmin;
