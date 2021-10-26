import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import { FeatureFlag } from '@/config/features';
import * as Session from '@/ducks/session';
import * as Workspace from '@/ducks/workspace';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { withoutFeatureGate } from '@/hocs';
import { useDispatch, useSelector } from '@/hooks';

/**
 * @deprecated no longer reqiured with atomic actions
 */
const WorkspaceMembersLoadingGate: React.FC = ({ children }) => {
  const activeWorkspaceID = useSelector(Session.activeWorkspaceIDSelector);
  const members = useSelector(WorkspaceV2.active.membersSelector);

  const loadMembers = useDispatch(Workspace.loadMembers, activeWorkspaceID!);

  return (
    <LoadingGate label="Members" isLoaded={!!members.length} load={loadMembers} zIndex={50} backgroundColor="#f9f9f9">
      {children}
    </LoadingGate>
  );
};

export default withoutFeatureGate(FeatureFlag.ATOMIC_ACTIONS)(WorkspaceMembersLoadingGate);
