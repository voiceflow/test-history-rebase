import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import { FeatureFlag } from '@/config/features';
import * as Session from '@/ducks/session';
import * as Workspace from '@/ducks/workspace';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, useFeature, useSelector } from '@/hooks';

// TODO: remove after atomic actions
const WorkspaceMembersLoadingGate: React.FC = ({ children }) => {
  const atomicActions = useFeature(FeatureFlag.ATOMIC_ACTIONS);

  const activeWorkspaceID = useSelector(Session.activeWorkspaceIDSelector);

  const membersV1 = useSelector(Workspace.activeWorkspaceMembersSelector);
  const membersRealtime = useSelector((state) => WorkspaceV2.workspaceMembersByIDSelector(state, { id: activeWorkspaceID }));

  const members = atomicActions.isEnabled ? membersRealtime : membersV1;

  const loadMembers = useDispatch(Workspace.loadMembers, activeWorkspaceID!);

  return (
    <LoadingGate label="Members" isLoaded={!!members.length} load={loadMembers} zIndex={50} backgroundColor="#f9f9f9">
      {children}
    </LoadingGate>
  );
};

export default WorkspaceMembersLoadingGate;
