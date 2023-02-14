import * as Realtime from '@voiceflow/realtime-sdk';
import { Members } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/constants/permissions';
import * as Account from '@/ducks/account';
import * as Workspace from '@/ducks/workspace';
import { useDispatch, usePermission, useSelector } from '@/hooks';

type WorkspaceMember = Realtime.WorkspaceMember | Realtime.PendingWorkspaceMember;

interface MemberListProps {
  inset?: boolean;
  members: WorkspaceMember[];
  hideLastDivider?: boolean;
}

const MemberList: React.FC<MemberListProps> = ({ inset, members, hideLastDivider = true }) => {
  const userID = useSelector(Account.userIDSelector)!;
  const [canEditRole] = usePermission(Permission.ADD_COLLABORATORS_V2);

  const sendInvite = useDispatch(Workspace.sendInviteToActiveWorkspace);
  const deleteMember = useDispatch(Workspace.deleteMemberOfActiveWorkspace);
  const cancelInvite = useDispatch(Workspace.cancelInviteToActiveWorkspace);
  const updateMemberRole = useDispatch(Workspace.updateActiveWorkspaceMemberRole);

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
      onChangeRole={(member, role) => updateMemberRole(member, role)}
      currentUserID={userID}
      canChangeRole={canEditRole}
      onResendInvite={(member) => sendInvite(member.email, null)}
      hideLastDivider={hideLastDivider}
    />
  );
};

export default MemberList;
