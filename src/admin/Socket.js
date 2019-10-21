import axios from 'axios';
import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';
import Markdown from 'markdown-to-jsx';
import randomstring from 'randomstring';
import React from 'react';
import { Alert } from 'reactstrap';
import socket from 'socket.io-client';

import { API_HOST, DEVICE_INFO, IS_DEVELOPMENT, LOGROCKET_ENABLED, LOGROCKET_PROJECT } from '@/config';
import { setConfirm } from '@/ducks/modal';
import { getAuthCookie } from '@/utils/cookies';

// setup LogRocket
if (LOGROCKET_ENABLED) {
  LogRocket.init(LOGROCKET_PROJECT);
  setupLogRocketReact(LogRocket);

  LogRocket.getSessionURL((sessionURL) => {
    // add session URL to all outgoing HTTP requests
    axios.defaults.headers.common['X-LogRocket-URL'] = sessionURL;
  });
}

// setup socket.io

if (!sessionStorage.getItem('tabId')) {
  sessionStorage.setItem('tabId', randomstring.generate());
}

const tabId = sessionStorage.getItem('tabId');

const getEndpoint = () => {
  let port = '';
  if (IS_DEVELOPMENT) {
    port = ':8080';
  }
  return `https://${API_HOST}${port}`;
};

// Configure axios
axios.defaults.baseURL = getEndpoint();
axios.defaults.withCredentials = true;
axios.defaults.crossDomain = true;

const socketFail = () => {
  window.CreatorSocket.status = 'FAIL';
};

window.CreatorSocket = socket(getEndpoint());

window.CreatorSocket.status = 'CONNECTING';

axios.defaults.headers.common.tabid = tabId;

window.CreatorSocket.connectedCB = {};
// catch error events
window.CreatorSocket.on('fail', socketFail);
window.CreatorSocket.on('error', socketFail);
// to catch if the server is offline
window.CreatorSocket.on('connect_error', socketFail);
// catch failed connection attempts
window.CreatorSocket.on('connect_failed', socketFail);
// to catch connection events
window.CreatorSocket.on('connect', () => {
  window.CreatorSocket.emit('init', { auth: getAuthCookie(), device: DEVICE_INFO, tabId });
});

window.CreatorSocket.authCB = (token) => window.CreatorSocket.emit('init', { auth: token || getAuthCookie(), device: DEVICE_INFO, tabId });

window.CreatorSocket.on('init', () => {
  window.CreatorSocket.status = 'CONNECTED';
  // queued up events after reconnection
  Object.values(window.CreatorSocket.connectedCB).forEach((cb) => typeof cb === 'function' && cb());
});
window.addEventListener('beforeunload', () => {
  if (window.CreatorSocket && window.CreatorSocket.disconnect) {
    window.CreatorSocket.disconnect();
  }
});

window.CreatorSocket.on('force_refresh', () => {
  window.location.reload(true);
});

window.CreatorSocket.on('show_message', (data) => {
  if (data.redirect) {
    window.location.replace(data.redirect);
    // eslint-disable-next-line xss/no-location-href-assign
    window.location.href = data.redirect;
    throw new Error('REDIRECT');
  } else if (data.message && window.store) {
    window.store.dispatch(
      setConfirm({
        size: 'rg',
        text: (
          <Alert className="mb-0" color={data.type}>
            <Markdown>{data.message}</Markdown>
          </Alert>
        ),
      })
    );
  }
});
