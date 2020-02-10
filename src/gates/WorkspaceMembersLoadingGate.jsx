import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import { activeWorkspaceIDSelector, activeWorkspaceMembersSelector, getMembers } from '@/ducks/workspace';
import { connect } from '@/hocs';

const WorkspaceMembersLoadingGate = ({ loadWorkspaceMembers, children, activeWorkspaceMembers }) => (
  <LoadingGate label="Members" isLoaded={activeWorkspaceMembers} load={loadWorkspaceMembers} zIndex={50} backgroundColor="#f9f9f9">
    {children}
  </LoadingGate>
);

const mapStateToProps = {
  activeWorkspaceID: activeWorkspaceIDSelector,
  activeWorkspaceMembers: activeWorkspaceMembersSelector,
};

const mapDispatchToProps = {
  getMembers,
};

const mergeProps = ({ activeWorkspaceID }, { getMembers }) => ({
  loadWorkspaceMembers: () => getMembers(activeWorkspaceID),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(WorkspaceMembersLoadingGate);
