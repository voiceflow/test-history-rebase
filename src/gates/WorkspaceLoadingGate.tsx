import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { ConnectedProps, MergeArguments } from '@/types';

const WorkspaceLoadingGate: React.FC<ConnectedWorkspaceLoadingGateProps> = ({ activeWorkspace, loadWorkspace, children }) => (
  <LoadingGate label="Team" isLoaded={!!activeWorkspace} load={loadWorkspace} zIndex={50} backgroundColor="#f9f9f9">
    {children}
  </LoadingGate>
);

const mapStateToProps = {
  activeWorkspace: Workspace.activeWorkspaceSelector,
};

const mapDispatchToProps = {
  fetchWorkspaces: Workspace.fetchWorkspaces,
  getMembers: Workspace.getMembers,
};

const mergeProps = (...[, { fetchWorkspaces }]: MergeArguments<typeof mapStateToProps, typeof mapDispatchToProps>) => ({
  loadWorkspace: fetchWorkspaces,
});

type ConnectedWorkspaceLoadingGateProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps, typeof mergeProps>;

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(WorkspaceLoadingGate);
