import React from 'react';

import client from '@/client';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';

const GlobalSocketSubscriptionsLoadingGate: React.FC<ConnectedGlobalSocketSubscriptionsLoadingGateProps> = ({
  children,
  patchWorkspace,
  ejectFromWorkspace,
}) => {
  React.useEffect(() => client.socket.global.watchForceRefresh(() => window.location.reload(true)));
  React.useEffect(() => client.socket.global.watchWorkspaceMembers(({ workspaceID, members }) => patchWorkspace(workspaceID, { members })));
  React.useEffect(() =>
    client.socket.global.watchForMembershipRevoked(({ workspaceId, workspaceName }) => ejectFromWorkspace(workspaceId, workspaceName))
  );

  return <>{children}</>;
};

const mapDispatchToProps = {
  patchWorkspace: Workspace.patchWorkspace,
  ejectFromWorkspace: Workspace.ejectFromWorkspace,
};

type ConnectedGlobalSocketSubscriptionsLoadingGateProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(GlobalSocketSubscriptionsLoadingGate);
