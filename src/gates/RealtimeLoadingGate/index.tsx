import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import { Permission } from '@/config/permissions';
import * as Realtime from '@/ducks/realtime';
import * as Session from '@/ducks/session';
import { connect } from '@/hocs';
import { usePermission } from '@/hooks';
import { ConnectedProps } from '@/types';

import { ConnectionWarning, DiagramHeartbeat, DiagramLifecycle, DisabledWarning, ReloadWarning } from './components';
import { RealtimeSubscriptionProvider } from './contexts';

const RealtimeLoadingGate: React.FC<ConnectedRealtimeLoadingGateProps> = ({
  locks,
  isWebsocketsEnabled,
  isConnected,
  isErrorState,
  setupConnection,
  terminateConnection,
  children,
}) => {
  const [isAllowed] = usePermission(Permission.CANVAS_REALTIME);

  if (!isAllowed) {
    return <RealtimeSubscriptionProvider>{children}</RealtimeSubscriptionProvider>;
  }

  if (!isWebsocketsEnabled) {
    return <DisabledWarning />;
  }

  return (
    <RealtimeSubscriptionProvider>
      <LoadingGate label="Collaboration" isLoaded={!!locks} load={setupConnection} unload={terminateConnection}>
        <DiagramLifecycle />
        {/* eslint-disable-next-line no-nested-ternary */}
        {isConnected ? (
          isErrorState ? (
            <ReloadWarning />
          ) : (
            <>
              <DiagramHeartbeat />
              {children}
            </>
          )
        ) : (
          <ConnectionWarning />
        )}
      </LoadingGate>
    </RealtimeSubscriptionProvider>
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

type ConnectedRealtimeLoadingGateProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(RealtimeLoadingGate) as React.FC;
