import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import { UserRole } from '@/constants';
import * as Realtime from '@/ducks/realtime';
import * as Session from '@/ducks/session';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';

import { ConnectionWarning, DisabledWarning, ReloadWarning } from './components';
import { RealtimeSubscriptionProvider } from './contexts';

export type RealtimeLoadingGateProps = {
  children: () => React.ReactElement;
};

const RealtimeLoadingGate: React.FC<RealtimeLoadingGateProps & ConnectedRealtimeLoadingGateProps> = ({
  locks,
  isWebsocketsEnabled,
  isConnected,
  isErrorState,
  setupConnection,
  terminateConnection,
  role,
  children,
}) => {
  if (role === UserRole.LIBRARY) {
    return <RealtimeSubscriptionProvider>{children()}</RealtimeSubscriptionProvider>;
  }

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
  role: Workspace.userRoleSelector,
};

const mapDispatchToProps = {
  setupConnection: Realtime.setupActiveDiagramConnection,
  terminateConnection: Realtime.terminateRealtimeConnection,
};

type ConnectedRealtimeLoadingGateProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(RealtimeLoadingGate) as React.FC<RealtimeLoadingGateProps>;
