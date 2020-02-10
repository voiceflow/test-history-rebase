import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import { activeWorkspaceSelector, fetchWorkspaces, getMembers } from '@/ducks/workspace';
import { connect } from '@/hocs';

const WorkspaceLoadingGate = ({ activeWorkspace, loadWorkspace, children }) => (
  <LoadingGate label="Team" isLoaded={activeWorkspace} load={loadWorkspace} zIndex={50} backgroundColor="#f9f9f9">
    {children}
  </LoadingGate>
);

const mapStateToProps = {
  activeWorkspace: activeWorkspaceSelector,
};

const mapDispatchToProps = {
  fetchWorkspaces,
  getMembers,
};

const mergeProps = (_, { fetchWorkspaces }) => ({
  loadWorkspace: fetchWorkspaces,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(WorkspaceLoadingGate);
