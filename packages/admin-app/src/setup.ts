import '@/utils/time';

import { clearPersistedLogs, GLOBAL_FETCH_HEADERS, IS_SAFARI, Vendors } from '@voiceflow/ui';
import axios from 'axios';
import cuid from 'cuid';

import client from '@/client';
import { API_ENDPOINT, LOGROCKET_PROJECT, VERSION } from '@/config';

import setupSocket from './client/socket';

const TAB_ID_KEY = 'tabId';

const ADMIN_ASCII = String.raw`
            _           __ _                __ _       _           _     __
/\   /\___ (_) ___ ___ / _| | _____      __/ //_\   __| |_ __ ___ (_)_ __\ \
\ \ / / _ \| |/ __/ _ \ |_| |/ _ \ \ /\ / / |//_\\ / _${'`'} | '_ ${'`'} _ \| | '_ \| |
 \ V / (_) | | (_|  __/  _| | (_) \ V  V /| /  _  \ (_| | | | | | | | | | | |
  \_/ \___/|_|\___\___|_| |_|\___/ \_/\_/ | \_/ \_/\__,_|_| |_| |_|_|_| |_| |
                                           \_\                           /_/
`;

const setupAdmin = () => {
  clearPersistedLogs();

  if (!sessionStorage.getItem(TAB_ID_KEY)) {
    sessionStorage.setItem(TAB_ID_KEY, cuid());
  }

  const tabID = sessionStorage.getItem(TAB_ID_KEY)!;

  axios.defaults.baseURL = API_ENDPOINT;
  axios.defaults.withCredentials = true;
  axios.defaults.headers.common.tabid = tabID;
  GLOBAL_FETCH_HEADERS.set('tabid', tabID);

  client.api.fetch.setOptions({
    headers: {
      tabid: tabID,
    },
  });

  Vendors.LogRocket.initialize({
    project: LOGROCKET_PROJECT,
    callback: (sessionURL) => {
      // add session URL to all outgoing HTTP requests
      axios.defaults.headers.common['x-logrocket-url'] = sessionURL;
      GLOBAL_FETCH_HEADERS.set('x-logrocket-url', sessionURL);
    },
    sessionRequestSanitizers: [
      {
        matcher: { method: 'PUT', route: '/session' },
        transform: (body: { user: { password: string } }) => ({ ...body, user: { ...body.user, password: Vendors.LogRocket.REDACTED } }),
      },
      {
        matcher: { method: 'PUT', route: '/googleLogin' },
        transform: (body: { user: { token: string } }) => ({ ...body, user: { ...body.user, token: Vendors.LogRocket.REDACTED } }),
      },
    ],
  });

  setupSocket(tabID);

  // eslint-disable-next-line no-console
  console.info(
    // safari doesn't use a monospaced font in its console so the ASCII art looks trash
    IS_SAFARI
      ? `%cVoiceflow Admin ${VERSION}`
      : `%c
${ADMIN_ASCII}

${VERSION}
  `,
    'color: grey'
  );
};

export default setupAdmin;
