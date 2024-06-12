import { UserRole } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Avatar, Members, TippyTooltip } from '@voiceflow/ui';
import pluralize from 'pluralize';
import React from 'react';

import { voiceflowLogomark } from '@/assets';
import { Permission } from '@/constants/permissions';
import * as Account from '@/ducks/account';
import * as Organization from '@/ducks/organization';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { usePermission } from '@/hooks/permission';
import { useSelector } from '@/hooks/redux';
import { isAdminUserRole, isEditorUserRole } from '@/utils/role';

import type { Member } from '../../types';
import * as S from './styles';

interface MembersListProps {
  members: Member[];
  onRemove: (memberID: number) => void;
  onChangeRole: (memberID: number, role: Member['role']) => void;
}

const ROLES = [UserRole.EDITOR, UserRole.VIEWER] satisfies UserRole[];

const MembersList: React.FC<MembersListProps> = ({ members, onRemove, onChangeRole }) => {
  const userID = useSelector(Account.userIDSelector);
  const workspace = useSelector(WorkspaceV2.active.workspaceSelector);
  const allMembersCount = useSelector(WorkspaceV2.active.members.allMembersCountSelector);
  const getWorkspaceMemberByID = useSelector(WorkspaceV2.active.members.getMemberByIDSelector);
  const getOrganizationMemberByID = useSelector(Organization.getMemberByIDSelector);

  const [canEditRole] = usePermission(Permission.WORKSPACE_MEMBER_ADD);

  const membersMetaMap = React.useMemo(
    () =>
      Object.fromEntries(
        members.map((member) => {
          const workspaceMember = getWorkspaceMemberByID({ creatorID: member.creator_id });
          const organizationMember = getOrganizationMemberByID({ creatorID: member.creator_id });

          if (!workspaceMember) return [member.creator_id, undefined];

          return [
            member.creator_id,
            {
              rolesConflict:
                isEditorUserRole(member.role) !== isEditorUserRole(workspaceMember.role) &&
                Realtime.Utils.role.isRoleAStrongerRoleB(workspaceMember.role, member.role),
              isOrganizationAdmin: organizationMember ? isAdminUserRole(organizationMember.role) : false,
            },
          ];
        })
      ),
    [members, getWorkspaceMemberByID]
  );

  const orderedMembers = React.useMemo(
    () =>
      [...members].sort((l, r) => {
        if (l.creator_id === userID || membersMetaMap[l.creator_id]?.isOrganizationAdmin) return -1;
        if (r.creator_id === userID || membersMetaMap[r.creator_id]?.isOrganizationAdmin) return 1;

        return 0;
      }),
    [members, membersMetaMap]
  );

  return !workspace ? null : (
    <>
      <S.Header border={!!orderedMembers.length}>
        <Avatar image={workspace.image ?? voiceflowLogomark} text={workspace.name} large squareRadius />

        <div>
          <S.Title>{workspace.name}</S.Title>
          <S.Subtitle>All {pluralize('member', allMembersCount, true)} have their default access</S.Subtitle>
        </div>
      </S.Header>

      <div>
        {orderedMembers.map((member, index) => (
          <Members.Row<Member>
            key={member.email}
            inset
            roles={ROLES}
            border={index + 1 !== members.length}
            member={member}
            onRemove={() => onRemove(member.creator_id)}
            onChangeRole={canEditRole ? (role) => onChangeRole(member.creator_id, role) : null}
            infoTooltip={
              membersMetaMap[member.creator_id]?.rolesConflict ? (
                <Members.RowWarningTooltip width={232} placement="bottom">
                  <TippyTooltip.Multiline>
                    This member can still edit this agent as they have edit access at the workspace level.
                  </TippyTooltip.Multiline>
                </Members.RowWarningTooltip>
              ) : null
            }
          />
        ))}
      </div>
    </>
  );
};

export default MembersList;
