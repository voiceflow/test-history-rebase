import React from 'react';

import WebsocketDisabledWarning from './components/WebsocketDisabledWarning';

/**
 * check that the device meets certain capabilities before loading the app
 */
const CapabilitiesGate: React.FC<React.PropsWithChildren> = ({ children }) => {
  const websocketsSupported = !!window.WebSocket;

  if (!websocketsSupported) {
    return <WebsocketDisabledWarning />;
  }

  return <>{children}</>;
};

export default CapabilitiesGate;
