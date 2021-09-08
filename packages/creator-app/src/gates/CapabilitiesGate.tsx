import React from 'react';

import * as Session from '@/ducks/session';
import { useDispatch, useSetup } from '@/hooks';

/**
 * check that the device meets certain capabilities before loading the app
 */
const CapabilitiesGate: React.FC = ({ children }) => {
  const websocketsSupported = !!window.WebSocket;
  const disableWebsockets = useDispatch(Session.disableWebsockets);

  useSetup(() => {
    if (!websocketsSupported) {
      disableWebsockets();
    }
  });

  return <>{children}</>;
};

export default CapabilitiesGate;
