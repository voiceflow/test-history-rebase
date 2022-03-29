import React from 'react';

import client from '@/client';
import * as Modal from '@/ducks/modal';
import * as Realtime from '@/ducks/realtime';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';

const ERROR_DISCONNECT_TIMEOUT = 5000;

const RealtimeDiagramLifecycle: React.FC<ConnectedRealtimeDiagramLifecycleProps> = ({
  disconnectRealtime,
  reestablishConnection,
  setupActiveDiagramConnection,
  browserID,
  goToDashboard,
  setError,
  setRealtimeError,
}) => {
  const disconnectTimeout = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    client.socket.global.watchForConnectionError(() => {
      if (!disconnectTimeout.current) {
        disconnectTimeout.current = setTimeout(() => {
          if (!client.socket.isConnected) {
            disconnectRealtime();
          }
        }, ERROR_DISCONNECT_TIMEOUT);
      }
      client.socket.global.setReconnectingStatus();
    });

    client.socket.global.watchForReconnected(() => {
      if (disconnectTimeout.current) {
        clearTimeout(disconnectTimeout.current);
      }
      reestablishConnection();
    });

    client.socket.global.watchForFailure(() => {
      disconnectRealtime();
      client.socket.disconnect();
    });

    client.socket.diagram.watchForceRefresh(() => {
      setRealtimeError();
    });

    return () => {
      if (disconnectTimeout.current) {
        clearTimeout(disconnectTimeout.current);
        disconnectTimeout.current = null;
      }
    };
  }, []);

  React.useEffect(() => client.socket.project.watchForSessionAcquired(setupActiveDiagramConnection), [setupActiveDiagramConnection]);

  React.useEffect(
    () =>
      client.socket.project.watchForSessionTerminated((data) => {
        if (data.browserID !== browserID) {
          goToDashboard();
          setError("You've been kicked out of the session");
        }
      }),
    [browserID, goToDashboard, setError]
  );

  return null;
};

const mapStateToPrpos = {
  browserID: Session.browserIDSelector,
};

const mapDispatchToPrpos = {
  goToDashboard: Router.goToDashboard,
  setError: Modal.setError,
  setRealtimeError: Realtime.setErrorState,
  disconnectRealtime: Realtime.disconnectRealtime,
  reestablishConnection: Realtime.reestablishConnection,
  setupActiveDiagramConnection: Realtime.setupActiveDiagramConnection,
};

type ConnectedRealtimeDiagramLifecycleProps = ConnectedProps<typeof mapStateToPrpos, typeof mapDispatchToPrpos>;

export default connect(mapStateToPrpos, mapDispatchToPrpos)(RealtimeDiagramLifecycle);
