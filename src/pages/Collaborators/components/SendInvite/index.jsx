import React from 'react';

import ButtonDropdownInput, { OrientationType } from '@/components/ButtonDropdownInput';
import Flex from '@/components/Flex';
import InvalidEmailError from '@/components/InvalidEmailError';
import { toast } from '@/components/Toast';
import { ModalType, UserRole } from '@/constants';
import {
  activeWorkspaceMembersSelector,
  planTypeSelector,
  seatLimits,
  usedEditorSeats,
  usedViewerSeats,
  workspaceNumberOfSeatsSelector,
} from '@/ducks/workspace';
import { connect } from '@/hocs';
import { useEnableDisable, useModals } from '@/hooks';
import { isValidEmail } from '@/utils/emails';

import Container from './components/Container';
import SendInviteButton from './components/SendInviteButton';

const OPTIONS_ARRAY = [
  { value: UserRole.EDITOR, label: 'can edit' },
  { value: UserRole.VIEWER, label: 'can view' },
];

function SendInvite({ sendInvite, numberOfSeats, seatLimits, usedEditorSeats, usedViewerSeats }) {
  const [email, setEmail] = React.useState('');
  const [permissionType, setPermissionType] = React.useState(OPTIONS_ARRAY[0]);
  const [isInvalid, setInvalid, setValid] = useEnableDisable(false);
  const { open: openPaymentsModal } = useModals(ModalType.PAYMENT);

  const onSendInviteClick = async () => {
    if (!isValidEmail(email)) {
      setInvalid();
    } else {
      setValid();
      const role = permissionType.value;

      const paidEditorSeats = numberOfSeats;
      const numberOfUsedEditorSeats = usedEditorSeats;

      if (numberOfUsedEditorSeats >= paidEditorSeats && permissionType.value === UserRole.EDITOR) {
        return openPaymentsModal();
      }

      const viewerLimit = seatLimits.viewer;
      if (usedViewerSeats >= viewerLimit && permissionType.value === UserRole.VIEWER) {
        return toast.error('Viewer limit reached.');
      }

      sendInvite(email, role);
      setEmail('');
    }
  };

  const setPermission = (value) => {
    const option = OPTIONS_ARRAY.filter((obj) => obj.value === value)[0];

    setPermissionType(option);
  };

  return (
    <Container error={isInvalid}>
      <Flex>
        <ButtonDropdownInput
          orientation={OrientationType.LEFT}
          textValue={email}
          dropdownValue={permissionType}
          onDropdownChange={setPermission}
          options={OPTIONS_ARRAY}
          placeholder="Enter email"
          onTextChange={setEmail}
          error={isInvalid}
          onFocus={setValid}
        />

        <SendInviteButton onClick={onSendInviteClick} variant="secondary" disabled={isInvalid}>
          Send Invite
        </SendInviteButton>
      </Flex>
      {isInvalid && <InvalidEmailError>Email is not valid.</InvalidEmailError>}
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
