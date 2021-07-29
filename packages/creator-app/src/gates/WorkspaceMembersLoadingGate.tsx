import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import * as Session from '@/ducks/session';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { ConnectedProps, MergeArguments } from '@/types';

const WorkspaceMembersLoadingGate: React.FC<ConnectedWorkspaceMembersLoadingGateProps> = ({ loadMembers, children, members }) => (
  <LoadingGate label="Members" isLoaded={!!members.length} load={loadMembers} zIndex={50} backgroundColor="#f9f9f9">
    {children}
  </LoadingGate>
);

const mapStateToProps = {
  activeWorkspaceID: Session.activeWorkspaceIDSelector,
  members: Workspace.activeWorkspaceMembersSelector,
};

const mapDispatchToProps = {
  loadMembers: Workspace.loadMembers,
};

const mergeProps = (...[{ activeWorkspaceID }, { loadMembers }]: MergeArguments<typeof mapStateToProps, typeof mapDispatchToProps>) => ({
  loadMembers: () => activeWorkspaceID && loadMembers(activeWorkspaceID),
});

type ConnectedWorkspaceMembersLoadingGateProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps, typeof mergeProps>;

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(WorkspaceMembersLoadingGate);
