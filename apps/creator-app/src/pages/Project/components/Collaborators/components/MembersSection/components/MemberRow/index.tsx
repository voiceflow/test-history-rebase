import { UserRole } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Menu, OverflowTippyTooltip } from '@voiceflow/ui';
import React from 'react';

import * as Account from '@/ducks/account';
import * as Workspace from '@/ducks/workspace';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useActiveWorkspace, useDispatch, useSelector } from '@/hooks';
import { ClassName } from '@/styles/constants';

import * as S from './styles';

const getRoleVerb = (role: UserRole) => {
  switch (role) {
    case UserRole.ADMIN:
      return 'Admin';
    case UserRole.EDITOR:
      return 'Editor';
    case UserRole.OWNER:
      return 'Owner';
    case UserRole.BILLING:
      return 'Billing';
    case UserRole.VIEWER:
    default:
      return 'Viewer';
  }
};

interface MemberRowProps {
  member: Realtime.AnyWorkspaceMember;
  isLast?: boolean;
  resendInvite: (email: string, role: UserRole) => Promise<void>;
}

const MemberRow: React.FC<MemberRowProps> = ({ member, resendInvite, isLast }) => {
  // TODO: refactor this to use the permission system
  const role = useSelector(WorkspaceV2.active.userRoleSelector);
  const userID = useSelector(Account.userIDSelector);
  const activeWorkspace = useActiveWorkspace();

  const deleteMember = useDispatch(Workspace.deleteMemberOfActiveWorkspace);
  const cancelInvite = useDispatch(Workspace.cancelInviteToActiveWorkspace);
  const updateMemberRole = useDispatch(Workspace.updateActiveWorkspaceMemberRole);

  const isPending = !member.creator_id;
  const userIsMember = userID === member.creator_id;
  const userIsViewer = role === UserRole.VIEWER;
  const memberIsAdminOrOwner = member.role === UserRole.OWNER || member.role === UserRole.ADMIN;
  const memberIsWorkspaceOwner = activeWorkspace?.creatorID && member.creator_id && activeWorkspace?.creatorID === member.creator_id;
  const allowDropdown = !userIsMember && !memberIsWorkspaceOwner && !userIsViewer && !(role === UserRole.EDITOR && memberIsAdminOrOwner);

  const changePermission = (role: UserRole) => updateMemberRole(member, role);

  const remove = () => {
    if (!member.creator_id) {
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

      <S.PermissionDropdown
        placement="bottom-end"
        menu={
          <Menu>
            <>
              <S.DropdownItem onClick={() => changePermission(UserRole.EDITOR)} active={member.role === UserRole.EDITOR}>
                {getRoleVerb(UserRole.EDITOR)}
              </S.DropdownItem>
              <S.DropdownItem onClick={() => changePermission(UserRole.VIEWER)} active={member.role === UserRole.VIEWER}>
                {getRoleVerb(UserRole.VIEWER)}
              </S.DropdownItem>
            </>
            {(role === UserRole.ADMIN || role === UserRole.OWNER) && (
              <>
                <S.DropdownItem onClick={() => changePermission(UserRole.ADMIN)} active={member.role === UserRole.ADMIN}>
                  {getRoleVerb(UserRole.ADMIN)}
                </S.DropdownItem>
                <S.DropdownItem onClick={() => changePermission(UserRole.BILLING)} active={member.role === UserRole.BILLING}>
                  {getRoleVerb(UserRole.BILLING)}
                </S.DropdownItem>
              </>
            )}
            <S.DropdownItem divider />

            {isPending && <S.DropdownItem onClick={() => resendInvite(member.email, member.role)}>Resend Invite</S.DropdownItem>}
            <S.DropdownItem onClick={remove}>{isPending ? 'Cancel Invite' : 'Remove Access'}</S.DropdownItem>
          </Menu>
        }
      >
        {({ ref, onToggle }) => (
          <S.PermissionsDropdownButton className={ClassName.MEMBER_ROLE_BUTTON} ref={ref} onClick={() => onToggle()} disabled={!allowDropdown}>
            {getRoleVerb(member.role)}
            {allowDropdown && <S.DropdownIcon size={8} icon="caretDown" />}
          </S.PermissionsDropdownButton>
        )}
      </S.PermissionDropdown>
    </S.Container>
  );
};

export default MemberRow;
