import { Flex, Menu } from '@voiceflow/ui';
import React from 'react';

import { FeatureFlag } from '@/config/features';
import { UserRole } from '@/constants';
import * as Account from '@/ducks/account';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { useFeature } from '@/hooks';
import { DBWorkspace } from '@/models';
import { ClassName } from '@/styles/constants';
import { ConnectedProps } from '@/types';

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
  member: DBWorkspace.Member;
  inline?: boolean;
  pending: boolean;
  resendInvite: (email: string, permissionType: UserRole | null, showToast?: boolean | undefined) => Promise<boolean>;
}

const MemberRow: React.FC<MemberRowProps & ConnectedMemberRowProps> = ({
  role,
  userID,
  member,
  inline,
  pending,
  resendInvite,
  deleteMember,
  cancelInvite,
  activeWorkspace,
  updateMemberRole,
}) => {
  const userIsMember = userID === member.creator_id;
  const ownerRole = useFeature(FeatureFlag.OWNER_ROLE);
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

  return (
    <Container className={ClassName.COLLABORATOR_LINE_ITEM} data-email={member.email}>
      <Flex>
        <UserIcon large pending={pending} user={member} />

        <div>
          {!pending && <MemberName>{member.name}</MemberName>}

          <MemberEmail pending={pending}>{member.email}</MemberEmail>
        </div>
      </Flex>

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

const mapStateToProps = {
  role: Workspace.userRoleSelector,
  userID: Account.userIDSelector,
  activeWorkspace: Workspace.activeWorkspaceSelector,
};

const mapDispatchToProps = {
  deleteMember: Workspace.deleteMemberOfActiveWorkspace,
  cancelInvite: Workspace.cancelInviteToActiveWorkspace,
  updateMemberRole: Workspace.updateActiveWorkspaceMemberRole,
};

type ConnectedMemberRowProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(MemberRow) as React.FC<MemberRowProps>;
