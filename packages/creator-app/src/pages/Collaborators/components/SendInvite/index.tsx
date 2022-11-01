import { Utils } from '@voiceflow/common';
import { UserRole } from '@voiceflow/internal';
import { Flex, toast } from '@voiceflow/ui';
import React from 'react';

import ButtonDropdownInput, { OrientationType } from '@/components/ButtonDropdownInput';
import InputError from '@/components/InputError';
import { Permission } from '@/config/permissions';
import { canAddEditor, EditorLimitDetails } from '@/config/planLimits/numEditors';
import { EDITOR_SEAT_ROLES, ModalType } from '@/constants';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useEnableDisable, useModals, usePermission, useSelector } from '@/hooks';
import { Identifier } from '@/styles/constants';

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

interface SendInviteProps {
  inline?: boolean;
  sendInvite: (email: string, role: UserRole) => void;
}

const SendInvite: React.FC<SendInviteProps> = ({ inline, sendInvite }) => {
  const [canManageAdminCollaborators] = usePermission(Permission.MANAGE_ADMIN_COLLABORATORS);
  const seatLimits = useSelector(WorkspaceV2.active.seatLimitsSelector);
  const numberOfSeats = useSelector(WorkspaceV2.active.numberOfSeatsSelector);
  const usedEditorSeats = useSelector(WorkspaceV2.active.usedEditorSeatsSelector);
  const usedViewerSeats = useSelector(WorkspaceV2.active.usedViewerSeatsSelector);

  const plan = useSelector(WorkspaceV2.active.planSelector);
  const { open: openUpgradeModal } = useModals(ModalType.UPGRADE_MODAL);

  const [email, setEmail] = React.useState('');
  const [permissionType, setPermissionType] = React.useState(OPTIONS_ARRAY[0]);
  const [isInvalid, setInvalid, setValid] = useEnableDisable(false);
  const { open: openPaymentsModal } = useModals(ModalType.PAYMENT);

  const inviteOptions = React.useMemo(() => {
    const options = [...OPTIONS_ARRAY];
    if (canManageAdminCollaborators) {
      options.push(ADMIN_OPTION);
    }
    return options;
  }, [canManageAdminCollaborators]);

  const onSendInviteClick = async () => {
    const trimmedEmail = email.trim();

    if (!Utils.emails.isValidEmail(trimmedEmail)) {
      setInvalid();
    } else {
      setValid();
      const role = permissionType.value;

      const paidEditorSeats = numberOfSeats!;

      if (usedEditorSeats >= paidEditorSeats && canAddEditor(plan, usedEditorSeats) && EDITOR_SEAT_ROLES.includes(role)) {
        return openPaymentsModal();
      }

      if (!canAddEditor(plan, usedEditorSeats) && EDITOR_SEAT_ROLES.includes(role)) {
        return openUpgradeModal({ planLimitDetails: EditorLimitDetails });
      }

      const viewerLimit = seatLimits!.viewer;
      if (usedViewerSeats >= viewerLimit && permissionType.value === UserRole.VIEWER) {
        return toast.error('Viewer limit reached.');
      }

      sendInvite(trimmedEmail, role);
      setEmail('');
    }
  };

  const setPermission = (value: UserRole) => {
    const option = inviteOptions.filter((obj) => obj.value === value)[0];

    setPermissionType(option);
  };

  return (
    <Container inline={inline} error={isInvalid}>
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

        <SendInviteButton id={Identifier.COLLAB_SEND_INVITE_BUTTON} onClick={onSendInviteClick} disabled={isInvalid}>
          Send
        </SendInviteButton>
      </Flex>

      {isInvalid && <InputError>Email is not valid.</InputError>}
    </Container>
  );
};

export default SendInvite;
