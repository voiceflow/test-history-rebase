import { Utils } from '@voiceflow/common';
import { UserRole } from '@voiceflow/internal';
import { Box, Button, Input, Members, SvgIcon, toast } from '@voiceflow/ui';
import React from 'react';

import InputError from '@/components/InputError';
import SelectInputGroup from '@/components/SelectInputGroup';
import { LimitType } from '@/constants/limits';
import * as Workspace from '@/ducks/workspace';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useGetPlanLimitedConfig } from '@/hooks/planLimitV2';
import { useDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';
import { useOnAddSeats } from '@/hooks/workspace';
import { Identifier } from '@/styles/constants';
import { isEditorUserRole } from '@/utils/role';

interface InviteByEmailProps {
  buttonLabel?: string;
}

const InviteByEmail: React.FC<InviteByEmailProps> = ({ buttonLabel = 'Add' }) => {
  const members = useSelector(WorkspaceV2.active.allNormalizedMembersSelector);
  const numberOfSeats = useSelector(WorkspaceV2.active.numberOfSeatsSelector);
  const usedEditorSeats = useSelector(WorkspaceV2.active.usedEditorSeatsSelector);
  const usedViewerSeats = useSelector(WorkspaceV2.active.usedViewerSeatsSelector);
  const viewerSeatLimits = useSelector(WorkspaceV2.active.viewerSeatLimitsSelector);

  const getEditorSeatLimit = useGetPlanLimitedConfig(LimitType.EDITOR_SEATS, { limit: numberOfSeats });

  const sendInvite = useDispatch(Workspace.sendInviteToActiveWorkspace);

  const onAddSeats = useOnAddSeats();

  const [role, setRole] = React.useState<UserRole>(UserRole.EDITOR);
  const [error, setError] = React.useState('');
  const [emails, setEmails] = React.useState('');

  const onSendInviteClick = async () => {
    const trimmedEmails = emails.split(',').map((email) => email.trim());

    if (!trimmedEmails.every(Utils.emails.isValidEmail)) {
      setError(trimmedEmails.length > 1 ? 'Some emails are invalid.' : 'Invalid email address.');
      return;
    }

    const emailsToInvite = trimmedEmails.filter((email) => !members.some((member) => member.email === email));

    if (!emailsToInvite.length) {
      setError(trimmedEmails.length > 1 ? 'Members are already in this workspace.' : 'Member is already in this workspace.');
      return;
    }

    setError('');

    const isEditorRole = isEditorUserRole(role);
    const updatedEditorSeats = usedEditorSeats + (isEditorRole ? emailsToInvite.length : 0);
    const updatedViewerSeats = usedViewerSeats + (isEditorRole ? 0 : emailsToInvite.length);
    const editorSeatLimit = getEditorSeatLimit({ value: updatedEditorSeats });

    if (editorSeatLimit && isEditorRole) {
      onAddSeats(updatedEditorSeats);

      return;
    }

    if (updatedViewerSeats >= viewerSeatLimits && role === UserRole.VIEWER) {
      toast.error('Viewer limit reached.');
      return;
    }

    if (emailsToInvite.length > 1) {
      emailsToInvite.forEach((email) => sendInvite({ email, role, showToast: false }));

      toast.success(`Sent ${emailsToInvite.length} invites`);
    } else {
      sendInvite({ email: emailsToInvite[0], role });
    }

    setEmails('');
  };

  return (
    <Box width="100%">
      <Box.Flex gap={12} fullWidth>
        <SelectInputGroup
          renderInput={(props) => (
            <Input
              {...props}
              icon={!emails ? 'email' : undefined}
              value={emails}
              error={!!error}
              onFocus={() => setError('')}
              iconProps={{ variant: SvgIcon.Variant.STANDARD, opacity: true }}
              placeholder="Email, comma separated"
              onChangeText={setEmails}
            />
          )}
        >
          {() => <Members.RoleSelect value={role} onChange={setRole} />}
        </SelectInputGroup>

        <Button id={Identifier.COLLAB_SEND_INVITE_BUTTON} onClick={onSendInviteClick} disabled={!!error || !emails} variant={Button.Variant.PRIMARY}>
          {buttonLabel}
        </Button>
      </Box.Flex>

      {error && <InputError mb={0}>{error}</InputError>}
    </Box>
  );
};

export default InviteByEmail;
