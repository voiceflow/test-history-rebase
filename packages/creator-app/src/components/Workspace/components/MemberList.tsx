import { UserRole } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Members } from '@voiceflow/ui';
import React from 'react';

import * as Workspace from '@/ducks/workspace';
import { useDispatch } from '@/hooks';

type WorkspaceMember = Realtime.WorkspaceMember | Realtime.PendingWorkspaceMember;

interface MemberListProps {
  inset?: boolean;
  hideLastDivider?: boolean;
  members: WorkspaceMember[];
}

const MemberList: React.FC<MemberListProps> = ({ inset, members, hideLastDivider = true }) => {
  const sendInvite = useDispatch(Workspace.sendInviteToActiveWorkspace);
  const deleteMember = useDispatch(Workspace.deleteMemberOfActiveWorkspace);
  const cancelInvite = useDispatch(Workspace.cancelInviteToActiveWorkspace);
  const updateMemberRole = useDispatch(Workspace.updateActiveWorkspaceMemberRole);

  const onResendInvite = (member: WorkspaceMember) => sendInvite(member.email, null);

  const onChangeRoles = (member: WorkspaceMember, roles: UserRole[]) => {
    const role = roles[0]; // FIXME: user does not support multiple roles yet
    updateMemberRole(member, role);
  };

  const onRemove = (member: WorkspaceMember) => {
    if (!member.creator_id) {
      cancelInvite(member.email);
    } else {
      deleteMember(member.creator_id);
    }
  };

  return (
    <Members.List
      inset={inset}
      members={members}
      onRemove={onRemove}
      onResendInvite={onResendInvite}
      onChangeRoles={onChangeRoles}
      hideLastDivider={hideLastDivider}
    />
  );
};

export default MemberList;
