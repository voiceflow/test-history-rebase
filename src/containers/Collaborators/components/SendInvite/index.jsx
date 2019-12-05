import React from 'react';

import ButtonDropdownInput, { ORIENTATION_TYPE } from '@/components/ButtonDropdownInput';
import { MODALS } from '@/constants';
import { useModals } from '@/contexts/ModalsContext';
import { activeWorkspaceMembersSelector, workspaceNumberOfSeatsSelector } from '@/ducks/workspace';
import { connect } from '@/hocs';

import { BILLING_SEATS_ELEMENT } from '../../../Payment/Checkout/components/SeatsAndBilling/components/SeatsInput';
import Container from './components/Container';
import SendInviteButton from './components/SendInviteButton';

const OPTIONS_ARRAY = [{ value: 'editor', label: 'can edit' }, { value: 'viewer', label: 'can view' }];

function SendInvite({ sendInvite, numberOfSeats, members }) {
  const [email, setEmail] = React.useState('');
  const [permissionType, setPermissionType] = React.useState(OPTIONS_ARRAY[0]);
  const { open: openPaymentsModal } = useModals(MODALS.PAYMENT);

  const onSendInviteClick = async () => {
    if (members.length >= numberOfSeats) {
      openPaymentsModal({ focus: BILLING_SEATS_ELEMENT });
      return;
    }

    await sendInvite(email, permissionType.value);

    setEmail('');
  };

  const setPermission = (value) => {
    const option = OPTIONS_ARRAY.filter((obj) => obj.value === value)[0];

    setPermissionType(option);
  };

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
  members: activeWorkspaceMembersSelector,
  numberOfSeats: workspaceNumberOfSeatsSelector,
};

export default connect(mapStateToProps)(SendInvite);
