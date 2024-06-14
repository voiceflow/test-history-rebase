import { UserRole } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Members, OverflowTippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/constants/permissions';
import * as Account from '@/ducks/account';
import * as Organization from '@/ducks/organization';
import * as Workspace from '@/ducks/workspaceV2';
import { useDispatch, usePermission, useSelector } from '@/hooks';
import { ClassName } from '@/styles/constants';
import { isAdminUserRole } from '@/utils/role';

import * as S from './styles';

interface MemberRowProps {
  member: Realtime.AnyWorkspaceMember;
  isLast?: boolean;
  resendInvite: (email: string, role: UserRole) => Promise<void>;
}

const MemberRow: React.FC<MemberRowProps> = ({ member, resendInvite, isLast }) => {
  const userID = useSelector(Account.userIDSelector);
  const organizationMember = useSelector(Organization.memberByIDSelector, { creatorID: member.creator_id });

  const deleteMember = useDispatch(Workspace.deleteMemberOfActiveWorkspace);
  const cancelInvite = useDispatch(Workspace.cancelInviteToActiveWorkspace);
  const updateMemberRole = useDispatch(Workspace.updateActiveWorkspaceMemberRole);

  const [canAddCollaborators] = usePermission(Permission.WORKSPACE_MEMBER_ADD);

  const isPending = !member.creator_id;

  const onChangeRole = (role: UserRole) => updateMemberRole(member, role);

  const onRemove = () => {
    if (!member.creator_id) {
      cancelInvite(member.email);
    } else {
      deleteMember(member.creator_id);
    }
  };

  return (
    <S.Container className={ClassName.COLLABORATOR_LINE_ITEM} isLast={isLast} data-email={member.email}>
      <Box.Flex flex={1} paddingY={4} overflowX="hidden">
        <S.UserIcon large user={member} />

        <Box flex={1} overflowX="hidden">
          {!isPending && <S.MemberName>{member.name}</S.MemberName>}

          <OverflowTippyTooltip<HTMLDivElement> style={{ display: 'block' }} content={member.email}>
            {(ref) => (
              <S.MemberEmail ref={ref} pending={isPending}>
                {member.email}
              </S.MemberEmail>
            )}
          </OverflowTippyTooltip>
        </Box>
      </Box.Flex>

      <Members.RoleSelect
        value={member.role}
        label={isAdminUserRole(organizationMember?.role) ? 'Owner' : undefined}
        disabled={userID === member.creator_id || !canAddCollaborators}
        isInvite={isPending}
        onChange={onChangeRole}
        onRemove={onRemove}
        onResendInvite={isPending ? () => resendInvite(member.email, member.role) : null}
      />
    </S.Container>
  );
};

export default MemberRow;
