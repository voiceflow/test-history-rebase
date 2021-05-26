import React from 'react';

import Flex from '@/components/Flex';
import Menu from '@/components/Menu';
import { toast } from '@/components/Toast';
import { FeatureFlag } from '@/config/features';
import { EDITOR_SEAT_ROLES, UserRole } from '@/constants';
import * as Account from '@/ducks/account';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { useFeature } from '@/hooks';
import { FadeLeftContainer } from '@/styles/animations';
import { ClassName } from '@/styles/constants';

import { Container, DropdownIcon, DropdownItem, MemberName, PermissionDropdown, PermissionsDropdownButton, UserIcon } from './components';

const isVerifiedMember = (member) => !!member.creator_id;

const getRoleVerb = (role) => {
  switch (role) {
    case UserRole.ADMIN:
      return 'Admin';
    case UserRole.EDITOR:
      return 'Editor';
    case UserRole.OWNER:
      return 'Manager';
    case UserRole.VIEWER:
    default:
      return 'Viewer';
  }
};

const MemberRow = ({
  member,
  isAdmin,
  pending,
  resendInvite,
  numberOfUsedEditorSeats,
  numberOfUsedViewerSeats,
  updateMember,
  deleteMember,
  cancelInvite,
  updateInvite,
  seatLimits,
  seats,
  role,
  userId,
  activeWorkspace,
}) => {
  const userIsMember = userId === member.creator_id;
  const ownerRole = useFeature(FeatureFlag.OWNER_ROLE);
  const memberIsWorkspaceOwner = activeWorkspace.creatorID === member.creator_id;
  const allowDropdown =
    !userIsMember &&
    !isAdmin &&
    !memberIsWorkspaceOwner &&
    !(role === UserRole.EDITOR && (member.role === UserRole.OWNER || member.role === UserRole.ADMIN));

  const changePermission = (role) => {
    const isAlreadyEditorSeatType = EDITOR_SEAT_ROLES.includes(member.role);

    if (role === member.role) {
      return;
    }

    if (
      !isAlreadyEditorSeatType &&
      (role === UserRole.EDITOR || role === UserRole.OWNER || role === UserRole.ADMIN) &&
      numberOfUsedEditorSeats >= seats
    ) {
      return toast.error('You have reached your max editor seats usage.');
    }
    if (role === UserRole.VIEWER && numberOfUsedViewerSeats >= seatLimits.viewer) {
      return toast.error('You have reached your max viewer seats usage.');
    }

    if (isVerifiedMember(member)) {
      updateMember(member.creator_id, role);
      return;
    }

    updateInvite(member.email, role);
  };

  const remove = () => {
    if (pending) {
      cancelInvite(member.email);
      return;
    }

    deleteMember(member.creator_id);
  };

  return (
    <Container className={ClassName.COLLABORATOR_LINE_ITEM} data-email={member.email}>
      <FadeLeftContainer>
        <Flex>
          <UserIcon pending={pending} user={member} />
          <MemberName pending={pending}>{pending ? member.email : member.name}</MemberName>
        </Flex>
      </FadeLeftContainer>

      <PermissionDropdown
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
              </>
            )}
            <DropdownItem divider />

            {pending && <DropdownItem onClick={() => resendInvite(member.email, null)}>Resend Invite</DropdownItem>}
            <DropdownItem onClick={remove}>{pending ? 'Cancel Invite' : 'Remove Access'}</DropdownItem>
          </Menu>
        }
      >
        {(ref, onToggle) => (
          <PermissionsDropdownButton className={ClassName.MEMBER_ROLE_BUTTON} ref={ref} onClick={() => allowDropdown && onToggle()}>
            {isAdmin ? (
              <span>Admin</span>
            ) : (
              <>
                {getRoleVerb(member.role)}
                {allowDropdown && <DropdownIcon size={8} icon="caretDown" />}
              </>
            )}
          </PermissionsDropdownButton>
        )}
      </PermissionDropdown>
    </Container>
  );
};

const mapStateToProps = {
  numberOfUsedEditorSeats: Workspace.usedEditorSeatsSelector,
  role: Workspace.userRoleSelector,
  userId: Account.userIDSelector,
  numberOfUsedViewerSeats: Workspace.usedViewerSeatsSelector,
  seatLimits: Workspace.seatLimitsSelector,
  seats: Workspace.workspaceNumberOfSeatsSelector,
  activeWorkspace: Workspace.activeWorkspaceSelector,
};

const mapDispatchToProps = {
  updateMember: Workspace.updateMember,
  deleteMember: Workspace.deleteMember,
  cancelInvite: Workspace.cancelInvite,
  updateInvite: Workspace.updateInvite,
};

export default connect(mapStateToProps, mapDispatchToProps)(MemberRow);
