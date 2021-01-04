import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';

const WorkspaceLoadingGate: React.FC<ConnectedWorkspaceLoadingGateProps> = ({
  activeWorkspace,
  loadWorkspace,
  workspaceByActiveProjectID,
  updateCurrentWorkspace,
  children,
}) => {
  React.useEffect(() => {
    if (workspaceByActiveProjectID?.id && activeWorkspace?.id !== workspaceByActiveProjectID.id) {
      updateCurrentWorkspace(workspaceByActiveProjectID.id);
    }
  }, [workspaceByActiveProjectID]);

  return (
    <LoadingGate label="Team" isLoaded={!!activeWorkspace} load={loadWorkspace} zIndex={50} backgroundColor="#f9f9f9">
      {children}
    </LoadingGate>
  );
};

const mapStateToProps = {
  activeWorkspace: Workspace.activeWorkspaceSelector,
  workspaceByActiveProjectID: Workspace.workspaceByProjectIDSelector,
};

const mapDispatchToProps = {
  loadWorkspace: Workspace.fetchWorkspaces,
  getMembers: Workspace.getMembers,
  updateCurrentWorkspace: Workspace.updateCurrentWorkspace,
};

type ConnectedWorkspaceLoadingGateProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(WorkspaceLoadingGate);
