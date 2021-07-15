import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';

import RealtimeWorkspaceSubscription from './RealtimeWorkspaceSubscription';

const WorkspacesLoadingGate: React.FC<ConnectedWorkspacesLoadingGateProps> = ({ loadWorkspaces, children }) => {
  const [isLoaded, setLoaded] = React.useState(false);

  const load = React.useCallback(async () => {
    await loadWorkspaces();

    setLoaded(true);
  }, []);

  return (
    <LoadingGate label="Workspaces" isLoaded={isLoaded} load={load} zIndex={50} backgroundColor="#f9f9f9">
      <RealtimeWorkspaceSubscription />
      {children}
    </LoadingGate>
  );
};

const mapDispatchToProps = {
  loadWorkspaces: Workspace.loadWorkspaces,
};

type ConnectedWorkspacesLoadingGateProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(WorkspacesLoadingGate);
