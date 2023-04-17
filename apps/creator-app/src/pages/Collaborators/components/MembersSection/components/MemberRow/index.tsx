import { UserRole } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Menu, OverflowTippyTooltip } from '@voiceflow/ui';
import React from 'react';

import * as Account from '@/ducks/account';
import * as Workspace from '@/ducks/workspace';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useActiveWorkspace, useDispatch, useSelector } from '@/hooks';
import { ClassName } from '@/styles/constants';

import {
  Container,
  DropdownIcon,
  DropdownItem,
  MemberEmail,
  MemberName,
  PermissionDropdown,
  PermissionsDropdownButton,
  UserIcon,
} from './components';

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
  inline?: boolean;
  isLast?: boolean;
  resendInvite: (email: string, role: UserRole) => Promise<void>;
}

const MemberRow: React.FC<MemberRowProps> = ({ member, inline, resendInvite, isLast }) => {
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
    <Container className={ClassName.COLLABORATOR_LINE_ITEM} isLast={isLast} data-email={member.email}>
      <Box.Flex flex={1} paddingY={4} overflowX="hidden">
        <UserIcon large user={member} />

        <Box flex={1} overflowX="hidden">
          {!isPending && <MemberName>{member.name}</MemberName>}

          <OverflowTippyTooltip<HTMLDivElement> style={{ display: 'block' }} content={member.email}>
            {(ref) => (
              <MemberEmail ref={ref} pending={isPending}>
                {member.email}
              </MemberEmail>
            )}
          </OverflowTippyTooltip>
        </Box>
      </Box.Flex>

      <PermissionDropdown
        placement={inline ? 'bottom-end' : 'bottom-start'}
        menu={
          <Menu>
            <>
              <DropdownItem onClick={() => changePermission(UserRole.EDITOR)} active={member.role === UserRole.EDITOR}>
                {getRoleVerb(UserRole.EDITOR)}
              </DropdownItem>
              <DropdownItem onClick={() => changePermission(UserRole.VIEWER)} active={member.role === UserRole.VIEWER}>
                {getRoleVerb(UserRole.VIEWER)}
              </DropdownItem>
            </>
            {(role === UserRole.ADMIN || role === UserRole.OWNER) && (
              <>
                <DropdownItem onClick={() => changePermission(UserRole.ADMIN)} active={member.role === UserRole.ADMIN}>
                  {getRoleVerb(UserRole.ADMIN)}
                </DropdownItem>
                <DropdownItem onClick={() => changePermission(UserRole.BILLING)} active={member.role === UserRole.BILLING}>
                  {getRoleVerb(UserRole.BILLING)}
                </DropdownItem>
              </>
            )}
            <DropdownItem divider />

            {isPending && <DropdownItem onClick={() => resendInvite(member.email, member.role)}>Resend Invite</DropdownItem>}
            <DropdownItem onClick={remove}>{isPending ? 'Cancel Invite' : 'Remove Access'}</DropdownItem>
          </Menu>
        }
      >
        {({ ref, onToggle }) => (
          <PermissionsDropdownButton className={ClassName.MEMBER_ROLE_BUTTON} ref={ref} onClick={() => onToggle()} disabled={!allowDropdown}>
            {getRoleVerb(member.role)}
            {allowDropdown && <DropdownIcon size={8} icon="caretDown" />}
          </PermissionsDropdownButton>
        )}
      </PermissionDropdown>
    </Container>
  );
};

export default MemberRow;
