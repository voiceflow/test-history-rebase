import { Utils } from '@voiceflow/common';
import { UserRole } from '@voiceflow/internal';
import { Flex, Input, Select, toast } from '@voiceflow/ui';
import React from 'react';

import InputError from '@/components/InputError';
import SelectInputGroup from '@/components/SelectInputGroup';
import { Permission } from '@/config/permissions';
import { canAddEditor, EditorLimitDetails } from '@/config/planLimits/numEditors';
import { EDITOR_SEAT_ROLES, ModalType } from '@/constants';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useEnableDisable, useModals, usePermission, useSelector } from '@/hooks';
import { ClassName, Identifier } from '@/styles/constants';

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
  const { open: openPaymentsModal } = useModals(ModalType.PAYMENT);

  const [role, setRole] = React.useState(UserRole.EDITOR);
  const [email, setEmail] = React.useState('');
  const [isInvalid, setInvalid, setValid] = useEnableDisable(false);

  const options = React.useMemo(
    () => (canManageAdminCollaborators ? [...OPTIONS_ARRAY, ADMIN_OPTION] : OPTIONS_ARRAY),
    [canManageAdminCollaborators]
  );
  const optionsMap = React.useMemo(() => Utils.array.createMap(options, (option) => option.value), [options]);

  const onSendInviteClick = async () => {
    const trimmedEmail = email.trim();

    if (!Utils.emails.isValidEmail(trimmedEmail)) {
      setInvalid();
      return;
    }

    setValid();

    const paidEditorSeats = numberOfSeats!;

    if (usedEditorSeats >= paidEditorSeats && canAddEditor(plan, usedEditorSeats) && EDITOR_SEAT_ROLES.includes(role)) {
      openPaymentsModal();
      return;
    }

    if (!canAddEditor(plan, usedEditorSeats) && EDITOR_SEAT_ROLES.includes(role)) {
      openUpgradeModal({ planLimitDetails: EditorLimitDetails });
      return;
    }

    if (usedViewerSeats >= (seatLimits?.viewer ?? 0) && role === UserRole.VIEWER) {
      toast.error('Viewer limit reached.');
      return;
    }

    sendInvite(trimmedEmail, role);
    setEmail('');
  };

  return (
    <Container inline={inline} error={isInvalid}>
      <Flex>
        <SelectInputGroup
          renderInput={(props) => (
            <Input {...props} value={email} error={isInvalid} onFocus={setValid} placeholder="Enter email" onChangeText={setEmail} />
          )}
        >
          {(props) => (
            <Select
              {...props}
              value={role}
              options={options}
              onSelect={setRole}
              className={ClassName.INVITE_ROLE_BUTTON}
              getOptionKey={(option) => option.value}
              getOptionValue={(option) => option?.value}
              getOptionLabel={(value) => value && optionsMap[value]?.label}
            />
          )}
        </SelectInputGroup>

        <SendInviteButton id={Identifier.COLLAB_SEND_INVITE_BUTTON} onClick={onSendInviteClick} disabled={isInvalid}>
          Send
        </SendInviteButton>
      </Flex>

      {isInvalid && <InputError>Email is not valid.</InputError>}
    </Container>
  );
};

export default SendInvite;
