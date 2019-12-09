import React from 'react';

import client from '@/client';
import LoadingGate from '@/components/LoadingGate';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';

const GLOBAL_EVENTS = {
  WORKSPACE_MEMBERS_UPDATE: 'workspace:members:update',
};

const GlobalSocketSubscriptionsLoadingGate = ({ children, updateWorkspace }) => {
  React.useEffect(() => {
    const handlers = {
      [GLOBAL_EVENTS.WORKSPACE_MEMBERS_UPDATE]: ({ workspaceID, members }) => updateWorkspace(workspaceID, { members }),
    };

    client.socket.global.initialize(handlers);
    client.socket.global.subscribe();

    return () => {
      client.socket.global.unsubscribe();
    };
  });

  return <LoadingGate isLoaded>{children}</LoadingGate>;
};

const mapDispatchToProps = {
  updateWorkspace: Workspace.updateWorkspace,
};

export default connect(
  null,
  mapDispatchToProps
)(GlobalSocketSubscriptionsLoadingGate);
