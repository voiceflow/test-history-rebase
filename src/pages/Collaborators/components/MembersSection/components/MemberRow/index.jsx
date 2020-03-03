import React from 'react';

import Flex from '@/components/Flex';
import Menu from '@/components/Menu';
import { toast } from '@/components/Toast';
import { USER_ROLES } from '@/constants';
import {
  cancelInvite,
  deleteMember,
  seatLimits,
  updateInvite,
  updateMember,
  usedEditorSeats,
  usedViewerSeats,
  workspaceNumberOfSeatsSelector,
} from '@/ducks/workspace';
import { connect } from '@/hocs';
import { FadeLeftContainer } from '@/styles/animations/FadeHorizontal';

import { Container, DropdownIcon, DropdownItem, MemberName, PermissionDropdown, PermissionsDropdownButton, UserIcon } from './components';

const isVerifiedMember = (member) => {
  return !!member.creator_id;
};

const getRoleVerb = (role) => {
  switch (role) {
    case USER_ROLES.ADMIN:
      return 'Owner';
    case USER_ROLES.EDITOR:
      return 'Can edit';
    case USER_ROLES.VIEWER:
    default:
      return 'Can view';
  }
};

const MemberRow = ({
  member,
  isOwner,
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
}) => {
  const changePermission = (role) => {
    if (role === member.role) {
      return;
    }

    if (role === USER_ROLES.EDITOR && numberOfUsedEditorSeats >= seats) {
      return toast.error('You have reached your max editor seats usage.');
    }
    if (role === USER_ROLES.VIEWER && numberOfUsedViewerSeats >= seatLimits.viewer) {
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
    <Container>
      <FadeLeftContainer>
        <Flex>
          <UserIcon pending={pending} user={member} />
          <MemberName pending={pending}>{pending ? member.email : member.name}</MemberName>
        </Flex>
      </FadeLeftContainer>

      <PermissionDropdown
        menu={
          <Menu>
            <DropdownItem onClick={() => changePermission(USER_ROLES.EDITOR)} active={member.role === USER_ROLES.EDITOR}>
              Can Edit
            </DropdownItem>
            <DropdownItem onClick={() => changePermission(USER_ROLES.VIEWER)} active={member.role === USER_ROLES.VIEWER}>
              Can View
            </DropdownItem>
            <DropdownItem divider />
            {pending && <DropdownItem onClick={() => resendInvite(member.email, null)}>Resend Invite</DropdownItem>}
            <DropdownItem onClick={remove}>{pending ? 'Cancel Invite' : 'Remove Access'}</DropdownItem>
          </Menu>
        }
      >
        {(ref, onToggle) => (
          <PermissionsDropdownButton ref={ref} onClick={() => !isOwner && onToggle()}>
            {isOwner ? (
              <span> Owner</span>
            ) : (
              <>
                {getRoleVerb(member.role)}
                <DropdownIcon size={8} icon="caretDown" />
              </>
            )}
          </PermissionsDropdownButton>
        )}
      </PermissionDropdown>
    </Container>
  );
};

const mapStateToProps = {
  numberOfUsedEditorSeats: usedEditorSeats,
  numberOfUsedViewerSeats: usedViewerSeats,
  seatLimits,
  seats: workspaceNumberOfSeatsSelector,
};

const MapDispatchToProps = {
  updateMember,
  deleteMember,
  cancelInvite,
  updateInvite,
};

export default connect(mapStateToProps, MapDispatchToProps)(MemberRow);
