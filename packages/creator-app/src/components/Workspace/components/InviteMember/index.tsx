import { Utils } from '@voiceflow/common';
import { UserRole } from '@voiceflow/internal';
import { ButtonVariant, Flex, Input, Members, SvgIcon, toast } from '@voiceflow/ui';
import React from 'react';

import InputError from '@/components/InputError';
import SelectInputGroup from '@/components/SelectInputGroup';
import { LimitType } from '@/config/planLimitV2';
import { EDITOR_SEAT_ROLES } from '@/constants';
import * as Workspace from '@/ducks/workspace';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, useGetPlanLimited, useSelector } from '@/hooks';
import { usePaymentModal, useUpgradeModal } from '@/ModalsV2/hooks';
import { Identifier } from '@/styles/constants';

import * as S from './styles';

interface WorkspaceInviteMemberProps {
  buttonLabel?: string;
}

const WorkspaceInviteMember: React.FC<WorkspaceInviteMemberProps> = ({ buttonLabel = 'Add' }) => {
  const members = useSelector(WorkspaceV2.active.membersSelector);
  const seatLimits = useSelector(WorkspaceV2.active.seatLimitsSelector);
  const numberOfSeats = useSelector(WorkspaceV2.active.numberOfSeatsSelector);
  const usedEditorSeats = useSelector(WorkspaceV2.active.usedEditorSeatsSelector);
  const usedViewerSeats = useSelector(WorkspaceV2.active.usedViewerSeatsSelector);

  const getEditorSeatLimit = useGetPlanLimited({ type: LimitType.EDITOR_SEATS, limit: numberOfSeats ?? 1 });

  const sendInvite = useDispatch(Workspace.sendInviteToActiveWorkspace);

  const paymentModal = usePaymentModal();
  const upgradeModal = useUpgradeModal();

  const [roles, setRoles] = React.useState<UserRole[]>([UserRole.EDITOR]);
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

    const role = roles[0]; // FIXME: we don't support multiple roles yet;
    const isEditorRole = EDITOR_SEAT_ROLES.includes(role);
    const updatedEditorSeats = usedEditorSeats + (isEditorRole ? emailsToInvite.length : 0);
    const updatedViewerSeats = usedViewerSeats + (isEditorRole ? 0 : emailsToInvite.length);
    const editorSeatLimit = getEditorSeatLimit({ value: updatedEditorSeats });

    if (editorSeatLimit) {
      if (editorSeatLimit.increasableLimit && editorSeatLimit.increasableLimit > updatedEditorSeats) {
        paymentModal.openVoid({});
      } else {
        upgradeModal.openVoid(editorSeatLimit.upgradeModal);
      }

      return;
    }

    if (updatedViewerSeats >= (seatLimits?.viewer ?? 5) && role === UserRole.VIEWER) {
      toast.error('Viewer limit reached.');
      return;
    }

    if (emailsToInvite.length > 1) {
      emailsToInvite.forEach((email) => sendInvite(email, role, false));

      toast.success(`Sent ${emailsToInvite.length} invites`);
    } else {
      sendInvite(emailsToInvite[0], role);
    }

    setEmails('');
  };

  return (
    <S.Container>
      <Flex gap={12} fullWidth>
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
          {() => <Members.RoleSelect roles={roles} isInvite onChange={setRoles} />}
        </SelectInputGroup>

        <S.Button id={Identifier.COLLAB_SEND_INVITE_BUTTON} onClick={onSendInviteClick} disabled={error || !emails} variant={ButtonVariant.PRIMARY}>
          {buttonLabel}
        </S.Button>
      </Flex>

      {error && <InputError mb={0}>{error}</InputError>}
    </S.Container>
  );
};

export default WorkspaceInviteMember;
