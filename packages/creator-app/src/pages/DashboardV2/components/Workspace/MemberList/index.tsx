import { UserRole } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import * as Workspace from '@/ducks/workspace';
import { useDispatch } from '@/hooks';

import MemberRow from '../../MemberRow';

type WorkspaceMember = Realtime.WorkspaceMember | Realtime.PendingWorkspaceMember;

interface WorkspaceMemberListProps {
  inset?: boolean;
  hideLastDivider?: boolean;
  members: WorkspaceMember[];
}

const WorkspaceMemberList: React.FC<WorkspaceMemberListProps> = ({ inset, members, hideLastDivider = true }) => {
  const sendInvite = useDispatch(Workspace.sendInviteToActiveWorkspace);
  const deleteMember = useDispatch(Workspace.deleteMemberOfActiveWorkspace);
  const cancelInvite = useDispatch(Workspace.cancelInviteToActiveWorkspace);
  const updateMemberRole = useDispatch(Workspace.updateActiveWorkspaceMemberRole);

  const handleSendInvite = (member: WorkspaceMember) => sendInvite(member.email, null);

  const handleChange = (member: WorkspaceMember, roles: UserRole[]) => {
    const role = roles[0]; // FIXME: user does not support multiple roles yet
    updateMemberRole(member, role);
  };

  const handleRemove = (member: WorkspaceMember) => {
    if (!member.creator_id) {
      cancelInvite(member.email);
    } else {
      deleteMember(member.creator_id);
    }
  };

  return (
    <div>
      {members.map((member, index) => (
        <MemberRow
          key={member.email}
          inset={inset}
          border={hideLastDivider ? index + 1 !== members?.length : true}
          member={member}
          onRemove={() => handleRemove(member)}
          onChangeRoles={(roles) => handleChange(member, roles)}
          onResendInvite={!member.creator_id ? () => handleSendInvite(member) : undefined}
        />
      ))}
    </div>
  );
};

export default WorkspaceMemberList;
