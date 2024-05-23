import { UserRole } from '@voiceflow/internal';
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
  const organizationMember = useSelector(Organization.memberByIDSelector, { creatorID: member.creatorId });

  const deleteMember = useDispatch(Workspace.deleteMemberOfActiveWorkspace);
  const cancelInvite = useDispatch(Workspace.cancelInviteToActiveWorkspace);
  const updateMemberRole = useDispatch(Workspace.updateActiveWorkspaceMemberRole);

  const [canAddCollaborators] = usePermission(Permission.ADD_COLLABORATORS);

  const isPending = !member.creatorId;

  const onChangeRole = (role: UserRole) => updateMemberRole(member, role);

  const onRemove = () => {
    if (!member.creatorId) {
      cancelInvite(member.email);
    } else {
      deleteMember(member.creator_id);
    }
  };

  // eslint-disable-next-line xss/no-mixed-html
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
        disabled={userID === member.creatorId || !canAddCollaborators}
        isInvite={isPending}
        onChange={onChangeRole}
        onRemove={onRemove}
        onResendInvite={isPending ? () => resendInvite(member.email, member.role) : null}
      />
    </S.Container>
  );
};

export default MemberRow;
