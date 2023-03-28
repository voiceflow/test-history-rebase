import * as Realtime from '@voiceflow/realtime-sdk';
import { Members } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/constants/permissions';
import * as Account from '@/ducks/account';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Workspace from '@/ducks/workspace';
import { useDispatch, usePermission, useSelector } from '@/hooks';
import { isEditorUserRole } from '@/utils/role';

interface MemberListProps {
  inset?: boolean;
  members: Realtime.AnyWorkspaceMember[];
  hideLastDivider?: boolean;
}

const MemberList: React.FC<MemberListProps> = ({ inset, members, hideLastDivider = true }) => {
  const userID = useSelector(Account.userIDSelector)!;
  const editorRoleProjectsByUserID = useSelector(ProjectV2.editorRoleProjectsByUserIDSelector);

  const [canEditRole] = usePermission(Permission.ADD_COLLABORATORS_V2);
  const [canManagerOrgMembers] = usePermission(Permission.ORGANIZATION_MANAGE_MEMBERS, { organizationAdmin: true });

  const sendInvite = useDispatch(Workspace.sendInviteToActiveWorkspace);
  const deleteMember = useDispatch(Workspace.deleteMemberOfActiveWorkspace);
  const cancelInvite = useDispatch(Workspace.cancelInviteToActiveWorkspace);
  const updateMemberRole = useDispatch(Workspace.updateActiveWorkspaceMemberRole);

  const onRemove = (member: Realtime.AnyWorkspaceMember) => {
    if (member.creator_id === null) {
      cancelInvite(member.email);
    } else {
      deleteMember(member.creator_id);
    }
  };

  const membersWithProjects = React.useMemo(
    () => members.map((member) => ({ ...member, projects: member.creator_id ? editorRoleProjectsByUserID[member.creator_id] : undefined })),
    [members, editorRoleProjectsByUserID]
  );

  return (
    <Members.List
      inset={inset}
      members={membersWithProjects}
      onRemove={onRemove}
      onChangeRole={canEditRole ? (member, role) => updateMemberRole(member, role) : null}
      canEditOwner={canManagerOrgMembers}
      isEditorRole={isEditorUserRole}
      currentUserID={userID}
      onResendInvite={(member) => sendInvite({ email: member.email, role: member.role })}
      hideLastDivider={hideLastDivider}
    />
  );
};

export default MemberList;
