import { UserRole } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, BoxFlex, Menu, OverflowTippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { FeatureFlag } from '@/config/features';
import * as Account from '@/ducks/account';
import * as Workspace from '@/ducks/workspace';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useActiveWorkspace, useDispatch, useFeature, useSelector } from '@/hooks';
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
      return 'Manager';
    case UserRole.BILLING:
      return 'Billing';
    case UserRole.VIEWER:
    default:
      return 'Viewer';
  }
};

interface MemberRowProps {
  member: Realtime.DBMember;
  inline?: boolean;
  isLast?: boolean;
  pending: boolean;
  resendInvite: (email: string, permissionType: UserRole | null, showToast?: boolean | undefined) => Promise<void>;
}

const MemberRow: React.FC<MemberRowProps> = ({ member, inline, pending, resendInvite, isLast }) => {
  const ownerRole = useFeature(FeatureFlag.OWNER_ROLE);

  // TODO: refactor this to use the permission system
  const role = useSelector(WorkspaceV2.active.userRoleSelector);
  const userID = useSelector(Account.userIDSelector);
  const activeWorkspace = useActiveWorkspace();

  const deleteMember = useDispatch(Workspace.deleteMemberOfActiveWorkspace);
  const cancelInvite = useDispatch(Workspace.cancelInviteToActiveWorkspace);
  const updateMemberRole = useDispatch(Workspace.updateActiveWorkspaceMemberRole);

  const userIsMember = userID === member.creator_id;
  const memberIsWorkspaceOwner = activeWorkspace?.creatorID === member.creator_id;
  const allowDropdown =
    !userIsMember && !memberIsWorkspaceOwner && !(role === UserRole.EDITOR && (member.role === UserRole.OWNER || member.role === UserRole.ADMIN));

  const changePermission = (role: UserRole) => updateMemberRole(member, role);

  const remove = () => {
    if (pending) {
      cancelInvite(member.email);
      return;
    }

    deleteMember(member.creator_id);
  };

  // eslint-disable-next-line xss/no-mixed-html
  return (
    <Container className={ClassName.COLLABORATOR_LINE_ITEM} isLast={isLast} data-email={member.email}>
      <BoxFlex flex={1} paddingY={4} overflowX="hidden">
        <UserIcon large pending={pending} user={member} />

        <Box flex={1} overflowX="hidden">
          {!pending && <MemberName>{member.name}</MemberName>}

          <OverflowTippyTooltip<HTMLDivElement> style={{ display: 'block' }} title={member.email}>
            {(ref) => (
              <MemberEmail ref={ref} pending={pending}>
                {member.email}
              </MemberEmail>
            )}
          </OverflowTippyTooltip>
        </Box>
      </BoxFlex>

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
            {(role === UserRole.OWNER || role === UserRole.ADMIN) && ownerRole.isEnabled && (
              <>
                <DropdownItem onClick={() => changePermission(UserRole.OWNER)} active={member.role === UserRole.OWNER}>
                  {getRoleVerb(UserRole.OWNER)}
                </DropdownItem>
              </>
            )}
            {role === UserRole.ADMIN && (
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

            {pending && <DropdownItem onClick={() => resendInvite(member.email, null)}>Resend Invite</DropdownItem>}
            <DropdownItem onClick={remove}>{pending ? 'Cancel Invite' : 'Remove Access'}</DropdownItem>
          </Menu>
        }
      >
        {(ref, onToggle) => (
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
