import React from 'react';

import client from '@/client';
import * as Modal from '@/ducks/modal';
import * as Realtime from '@/ducks/realtime';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';

const RealtimeDiagramLifecycle: React.FC<ConnectedRealtimeDiagramLifecycleProps> = ({
  disconnectRealtime,
  reestablishConnection,
  setupActiveDiagramConnection,
  browserID,
  goToDashboard,
  setError,
  setRealtimeError,
}) => {
  React.useEffect(
    () =>
      client.socket.global.watchForConnectionError(() =>
        client.socket.global.handleDisconnect(() => {
          disconnectRealtime();
        }, reestablishConnection)
      ),
    [disconnectRealtime, reestablishConnection]
  );

  React.useEffect(
    () =>
      client.socket.global.watchForFailure(() => {
        disconnectRealtime();
        client.socket.disconnect();
      }),
    [disconnectRealtime]
  );

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

  React.useEffect(
    () =>
      client.socket.diagram.watchForceRefresh(() => {
        setRealtimeError();
      }),
    [setRealtimeError]
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
