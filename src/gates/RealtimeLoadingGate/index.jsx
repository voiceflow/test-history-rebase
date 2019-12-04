import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import * as Realtime from '@/ducks/realtime';
import * as Session from '@/ducks/session';
import { connect } from '@/hocs';

import { ConnectionWarning, DisabledWarning, ReloadWarning } from './components';
import { RealtimeSubscriptionProvider } from './contexts';

const RealtimeLoadingGate = ({ locks, isWebsocketsEnabled, isConnected, isErrorState, setupConnection, terminateConnection, children }) => {
  if (!isWebsocketsEnabled) {
    return <DisabledWarning />;
  }

  return (
    <LoadingGate label="Collaboration" isLoaded={!!locks} load={setupConnection} unload={terminateConnection}>
      {() => (
        <RealtimeSubscriptionProvider>
          {/* eslint-disable-next-line no-nested-ternary */}
          {isConnected ? isErrorState ? <ReloadWarning /> : children() : <ConnectionWarning />}
        </RealtimeSubscriptionProvider>
      )}
    </LoadingGate>
  );
};

const mapStateToProps = {
  locks: Realtime.realtimeLocksSelector,
  isConnected: Realtime.isRealtimeConnectedSelector,
  isErrorState: Realtime.isErrorStateSelector,
  isWebsocketsEnabled: Session.isWebsocketsEnabledSelector,
};

const mapDispatchToProps = {
  setupConnection: Realtime.setupActiveDiagramConnection,
  terminateConnection: Realtime.terminateRealtimeConnection,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RealtimeLoadingGate);
