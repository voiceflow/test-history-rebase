import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { ConnectedProps, MergeArguments } from '@/types';

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
  fetchWorkspaces: Workspace.fetchWorkspaces,
  getMembers: Workspace.getMembers,
  updateCurrentWorkspace: Workspace.updateCurrentWorkspace,
};

const mergeProps = (...[, { fetchWorkspaces }]: MergeArguments<typeof mapStateToProps, typeof mapDispatchToProps>) => ({
  loadWorkspace: fetchWorkspaces,
});

type ConnectedWorkspaceLoadingGateProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps, typeof mergeProps>;

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(WorkspaceLoadingGate);
