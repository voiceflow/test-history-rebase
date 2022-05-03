import React from 'react';

import client from '@/client';
import * as Session from '@/ducks/session';
import { useStore } from '@/hooks';

const ProjectReconnectGate: React.FC = () => {
  const store = useStore();

  React.useEffect(
    () =>
      client.socket.global.watchForReconnected(() => {
        const activeProjectID = Session.activeProjectIDSelector(store.getState());

        if (activeProjectID) {
          client.socket?.project.initialize(activeProjectID);
        }
      }),
    []
  );

  return null;
};

export default ProjectReconnectGate;
