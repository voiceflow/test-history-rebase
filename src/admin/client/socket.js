import Markdown from 'markdown-to-jsx';
import React from 'react';
import { Alert } from 'reactstrap';
import socket from 'socket.io-client';

import { API_ENDPOINT, DEVICE_INFO } from '@/config';
import { setConfirm } from '@/ducks/modal';
import { getAuthCookie } from '@/utils/cookies';

const setupSocket = (tabID) => {
  const socketFail = () => {
    window.CreatorSocket.status = 'FAIL';
  };

  window.CreatorSocket = socket(API_ENDPOINT, {
    timeout: 5000,
    transports: ['websocket'],
    autoConnect: false,
  });

  window.CreatorSocket.status = 'CONNECTING';

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
    window.CreatorSocket.emit('init', { auth: getAuthCookie(), device: DEVICE_INFO, tabId: tabID });
  });

  window.CreatorSocket.authCB = (token) => window.CreatorSocket.emit('init', { auth: token || getAuthCookie(), device: DEVICE_INFO, tabId: tabID });

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
};

export default setupSocket;
