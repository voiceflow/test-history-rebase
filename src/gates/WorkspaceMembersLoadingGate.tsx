import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { ConnectedProps, MergeArguments } from '@/types';

const WorkspaceMembersLoadingGate: React.FC<ConnectedWorkspaceMembersLoadingGateProps> = ({
  loadWorkspaceMembers,
  children,
  activeWorkspaceMembers,
}) => (
  <LoadingGate label="Members" isLoaded={!!activeWorkspaceMembers} load={loadWorkspaceMembers} zIndex={50} backgroundColor="#f9f9f9">
    {children}
  </LoadingGate>
);

const mapStateToProps = {
  activeWorkspaceID: Workspace.activeWorkspaceIDSelector,
  activeWorkspaceMembers: Workspace.activeWorkspaceMembersSelector,
};

const mapDispatchToProps = {
  getMembers: Workspace.getMembers,
};

const mergeProps = (...[{ activeWorkspaceID }, { getMembers }]: MergeArguments<typeof mapStateToProps, typeof mapDispatchToProps>) => ({
  loadWorkspaceMembers: () => activeWorkspaceID && getMembers(activeWorkspaceID),
});

type ConnectedWorkspaceMembersLoadingGateProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps, typeof mergeProps>;

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(WorkspaceMembersLoadingGate);
