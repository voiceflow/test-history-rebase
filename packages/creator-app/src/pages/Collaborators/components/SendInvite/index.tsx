import { Flex, toast } from '@voiceflow/ui';
import React from 'react';

import ButtonDropdownInput, { OrientationType } from '@/components/ButtonDropdownInput';
import InvalidEmailError from '@/components/InvalidEmailError';
import { EDITOR_SEAT_ROLES, ModalType, UserRole } from '@/constants';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { useEnableDisable, useModals } from '@/hooks';
import { Identifier } from '@/styles/constants';
import { ConnectedProps } from '@/types';
import { isValidEmail } from '@/utils/emails';

import Container from './components/Container';
import SendInviteButton from './components/SendInviteButton';

const ADMIN_OPTION = {
  value: UserRole.ADMIN,
  label: 'can admin',
};

const OPTIONS_ARRAY = [
  { value: UserRole.EDITOR, label: 'can edit' },
  { value: UserRole.VIEWER, label: 'can view' },
];

type SendInviteProps = {
  sendInvite: (email: string, role: UserRole) => void;
};

const SendInvite: React.FC<SendInviteProps & ConnectedSendInviteProps> = ({
  sendInvite,
  numberOfSeats,
  seatLimits,
  usedEditorSeats,
  usedViewerSeats,
  userRole,
}) => {
  const [email, setEmail] = React.useState('');
  const [permissionType, setPermissionType] = React.useState(OPTIONS_ARRAY[0]);
  const [isInvalid, setInvalid, setValid] = useEnableDisable(false);
  const { open: openPaymentsModal } = useModals(ModalType.PAYMENT);

  const inviteOptions = React.useMemo(() => {
    const options = [...OPTIONS_ARRAY];
    if (userRole === UserRole.ADMIN) {
      options.push(ADMIN_OPTION);
    }
    return options;
  }, [userRole]);

  const onSendInviteClick = async () => {
    if (!isValidEmail(email)) {
      setInvalid();
    } else {
      setValid();
      const role = permissionType.value;

      const paidEditorSeats = numberOfSeats!;
      const numberOfUsedEditorSeats = usedEditorSeats;

      if (numberOfUsedEditorSeats >= paidEditorSeats && EDITOR_SEAT_ROLES.includes(UserRole.EDITOR)) {
        return openPaymentsModal();
      }

      const viewerLimit = seatLimits!.viewer;
      if (usedViewerSeats >= viewerLimit && permissionType.value === UserRole.VIEWER) {
        return toast.error('Viewer limit reached.');
      }

      sendInvite(email, role);
      setEmail('');
    }
  };

  const setPermission = (value: UserRole) => {
    const option = inviteOptions.filter((obj) => obj.value === value)[0];

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
          options={inviteOptions}
          placeholder="Enter email"
          onTextChange={setEmail}
          error={isInvalid}
          onFocus={setValid}
        />

        <SendInviteButton id={Identifier.COLLAB_SEND_INVITE_BUTTON} onClick={onSendInviteClick} variant="secondary" disabled={isInvalid}>
          Send Invite
        </SendInviteButton>
      </Flex>
      {isInvalid && <InvalidEmailError>Email is not valid.</InvalidEmailError>}
    </Container>
  );
};

const mapStateToProps = {
  seatLimits: Workspace.seatLimitsSelector,
  plan: Workspace.planTypeSelector,
  members: Workspace.activeWorkspaceMembersSelector,
  numberOfSeats: Workspace.workspaceNumberOfSeatsSelector,
  usedEditorSeats: Workspace.usedEditorSeatsSelector,
  usedViewerSeats: Workspace.usedViewerSeatsSelector,
  userRole: Workspace.userRoleSelector,
};

type ConnectedSendInviteProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(SendInvite) as React.FC<SendInviteProps>;
