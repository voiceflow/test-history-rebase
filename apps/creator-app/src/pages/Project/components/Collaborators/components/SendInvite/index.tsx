import { Utils } from '@voiceflow/common';
import type { ProjectUserRole } from '@voiceflow/dtos';
import { UserRole } from '@voiceflow/dtos';
import { Flex, Input, Select, toast, useEnableDisable } from '@voiceflow/ui';
import React from 'react';

import InputError from '@/components/InputError';
import SelectInputGroup from '@/components/SelectInputGroup';
import { LimitType } from '@/constants/limits';
import { Permission } from '@/constants/permissions';
import * as Organization from '@/ducks/organization';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { usePermission } from '@/hooks/permission';
import { useGetPlanLimitedConfig } from '@/hooks/planLimitV2';
import { useGetConditionalLimit } from '@/hooks/planLimitV3';
import { useSelector } from '@/hooks/redux';
import { useOnAddSeats } from '@/hooks/workspace';
import { ClassName, Identifier } from '@/styles/constants';
import { isEditorUserRole } from '@/utils/role';

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
  sendInvite: (data: { email: string; role: UserRole }) => void;
}

const SendInvite: React.FC<SendInviteProps> = ({ sendInvite }) => {
  const [canAddCollaborators] = usePermission(Permission.WORKSPACE_MEMBER_ADD);
  const [canManageAdminCollaborators] = usePermission(Permission.WORKSPACE_MEMBER_MANAGE_ADMIN);

  const numberOfSeats = useSelector(WorkspaceV2.active.numberOfSeatsSelector);
  const usedEditorSeats = useSelector(WorkspaceV2.active.members.usedEditorSeatsSelector);
  const usedViewerSeats = useSelector(WorkspaceV2.active.members.usedViewerSeatsSelector);
  const viewerPlanSeatLimits = useSelector(WorkspaceV2.active.viewerPlanSeatLimitsSelector);
  const subscription = useSelector(Organization.chargebeeSubscriptionSelector);

  const legacyGetEditorSeatLimit = useGetPlanLimitedConfig(LimitType.EDITOR_SEATS, { limit: numberOfSeats });
  const newGetEditorSeatLimit = useGetConditionalLimit(LimitType.EDITOR_SEATS);

  const getEditorSeatLimit = subscription ? newGetEditorSeatLimit : legacyGetEditorSeatLimit;

  const onAddSeats = useOnAddSeats();

  const [role, setRole] = React.useState<ProjectUserRole | 'admin'>(UserRole.EDITOR);
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

    const isEditorRole = isEditorUserRole(role);
    const updatedEditorSeats = usedEditorSeats + (isEditorRole ? 1 : 0);
    const updatedViewerSeats = usedViewerSeats + (isEditorRole ? 0 : 1);
    const editorSeatLimit = getEditorSeatLimit({ value: updatedEditorSeats });

    if (editorSeatLimit && isEditorRole) {
      onAddSeats(updatedEditorSeats);

      return;
    }

    if (updatedViewerSeats >= viewerPlanSeatLimits && role === UserRole.VIEWER) {
      toast.error('Viewer limit reached.');
      return;
    }

    sendInvite({ email: trimmedEmail, role });
    setEmail('');
  };

  return (
    <Container error={isInvalid}>
      <Flex>
        <SelectInputGroup
          renderInput={(props) => (
            <Input
              {...props}
              value={email}
              error={isInvalid}
              onFocus={setValid}
              readOnly={!canAddCollaborators}
              placeholder="Enter email"
              onChangeText={setEmail}
            />
          )}
        >
          {(props) => (
            <Select
              {...props}
              value={role}
              options={options}
              onSelect={setRole}
              disabled={!canAddCollaborators}
              className={ClassName.INVITE_ROLE_BUTTON}
              getOptionKey={(option) => option.value}
              getOptionValue={(option) => option?.value}
              getOptionLabel={(value) => value && optionsMap[value]?.label}
            />
          )}
        </SelectInputGroup>

        <SendInviteButton
          id={Identifier.COLLAB_SEND_INVITE_BUTTON}
          onClick={onSendInviteClick}
          disabled={isInvalid || !canAddCollaborators}
        >
          Send
        </SendInviteButton>
      </Flex>

      {isInvalid && <InputError>Email is not valid.</InputError>}
    </Container>
  );
};

export default SendInvite;
