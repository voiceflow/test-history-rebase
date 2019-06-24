import axios from 'axios';
import { getAuth } from 'ducks/account';
import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';
import randomstring from 'randomstring';
import socket from 'socket.io-client';

import { getDevice } from 'Helper';

import { LOGROCKET_ENABLED, LOGROCKET_PROJECT } from './config';

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
  let protocol = 'https';
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    port = ':8080';
    protocol = 'http';
  }
  return `${protocol}://${window.location.hostname}${port}`;
};

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
  window.CreatorSocket.emit('init', { auth: getAuth(), device: getDevice(), tabId });
});
window.CreatorSocket.on('init', () => {
  window.CreatorSocket.status = 'CONNECTED';
  // queued up events after reconnection
  Object.values(window.CreatorSocket.connectedCB).forEach((cb) => typeof cb === 'function' && cb());
});
window.addEventListener('beforeunload', function() {
  if (window.CreatorSocket && window.CreatorSocket.disconnect) {
    window.CreatorSocket.disconnect();
  }
});
