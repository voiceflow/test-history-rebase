import React from 'react';

import ButtonDropdownInput, { ORIENTATION_TYPE } from '@/components/ButtonDropdownInput';
import { toast } from '@/componentsV2/Toast';
import { MODALS, PLANS, USER_ROLES } from '@/constants';
import { useModals } from '@/contexts/ModalsContext';
import {
  activeWorkspaceMembersSelector,
  planTypeSelector,
  seatLimits,
  usedEditorSeats,
  usedViewerSeats,
  workspaceNumberOfSeatsSelector,
} from '@/ducks/workspace';
import { connect } from '@/hocs';

import Container from './components/Container';
import SendInviteButton from './components/SendInviteButton';

const OPTIONS_ARRAY = [{ value: USER_ROLES.EDITOR, label: 'can edit' }, { value: USER_ROLES.VIEWER, label: 'can view' }];

function SendInvite({ plan, sendInvite, numberOfSeats, members, seatLimits, usedEditorSeats, usedViewerSeats }) {
  const [email, setEmail] = React.useState('');
  const [permissionType, setPermissionType] = React.useState(OPTIONS_ARRAY[0]);
  const { open: openPaymentsModal } = useModals(MODALS.PAYMENT);

  const onSendInviteClick = async () => {
    const role = permissionType.value;

    const editorLimit = seatLimits.editor;
    const paidEditorSeats = numberOfSeats;
    const numberOfUsedEditorSeats = usedEditorSeats;

    if (editorLimit !== null && numberOfUsedEditorSeats >= paidEditorSeats && permissionType === USER_ROLES.EDITOR) {
      return openPaymentsModal();
    }

    const viewerLimit = seatLimits.viewer;
    if (viewerLimit !== null && usedViewerSeats >= viewerLimit && permissionType === USER_ROLES.VIEWER) {
      return toast.error('Viewer limit reached.');
    }

    sendInvite(email, role);
    setEmail('');
  };

  const setPermission = (value) => {
    const option = OPTIONS_ARRAY.filter((obj) => obj.value === value)[0];

    setPermissionType(option);
  };

  if (plan === PLANS.enterprise && members.length >= numberOfSeats) {
    return (
      <Container>
        Enterprise Workspace Seat Limit Reached
        <br />
        Contact Voiceflow for Allocation
      </Container>
    );
  }

  return (
    <Container>
      <ButtonDropdownInput
        orientation={ORIENTATION_TYPE.LEFT}
        regularInput
        textValue={email}
        dropdownValue={permissionType}
        onDropdownChange={setPermission}
        options={OPTIONS_ARRAY}
        placeholder="Enter email"
        onTextChange={setEmail}
      />

      <SendInviteButton onClick={onSendInviteClick} disabled={!email} variant="secondary">
        Send Invite
      </SendInviteButton>
    </Container>
  );
}

const mapStateToProps = {
  seatLimits,
  plan: planTypeSelector,
  members: activeWorkspaceMembersSelector,
  numberOfSeats: workspaceNumberOfSeatsSelector,
  usedEditorSeats,
  usedViewerSeats,
};

export default connect(mapStateToProps)(SendInvite);
