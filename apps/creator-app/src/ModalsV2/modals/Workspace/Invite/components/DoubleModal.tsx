import { UserRole } from '@voiceflow/internal';
import { Box, Button, Input, Members, Modal, OverflowText, System, toast } from '@voiceflow/ui';
import React from 'react';

import SelectInputGroup from '@/components/SelectInputGroup';
import * as WorkspaceUI from '@/components/Workspace';
import { LimitType } from '@/constants/limits';
import * as Organization from '@/ducks/organization';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, useGetPlanLimitedConfig, useOnAddSeats, useSelector } from '@/hooks';
import { useGetConditionalLimit } from '@/hooks/planLimitV3';
import type { VoidInternalProps } from '@/ModalsV2/types';
import { isEditorUserRole } from '@/utils/role';

import { useDedupeInvites, useInviteLink } from '../hooks';

const DoubleModal: React.FC<VoidInternalProps> = ({ api, type, opened, hidden, animated }) => {
  const numberOfSeats = useSelector(WorkspaceV2.active.numberOfSeatsSelector);
  const usedEditorSeats = useSelector(WorkspaceV2.active.usedEditorSeatsSelector);
  const subscription = useSelector(Organization.chargebeeSubscriptionSelector);

  const sendInvite = useDispatch(WorkspaceV2.sendInviteToActiveWorkspace);

  const getEditorSeatLimit = useGetPlanLimitedConfig(LimitType.EDITOR_SEATS, { limit: numberOfSeats });
  const getEditorConditionalLimit = useGetConditionalLimit(LimitType.EDITOR_SEATS);

  const onAddSeats = useOnAddSeats();

  const inviteLink = useInviteLink({ initialUserRole: UserRole.EDITOR });
  const dedupeInvites = useDedupeInvites();

  const onAddMembers = (emails: string[], role: UserRole) => {
    const newEmails = dedupeInvites(emails);

    const isEditorRole = isEditorUserRole(role);
    const updatedEditorSeats = usedEditorSeats + (isEditorRole ? newEmails.length : 0);
    // FIXME: remove FF https://voiceflow.atlassian.net/browse/CV3-994
    const editorSeatLimit = subscription
      ? getEditorConditionalLimit({ value: updatedEditorSeats, greaterOnly: true })
      : getEditorSeatLimit({ value: updatedEditorSeats, greaterOnly: true });

    if (editorSeatLimit && isEditorRole) {
      onAddSeats(updatedEditorSeats);
      return;
    }

    if (newEmails.length > 1) {
      newEmails.forEach((email) => sendInvite({ email, role, showToast: false }));
      toast.success(`Sent ${newEmails.length} invites`);
    } else {
      sendInvite({ email: newEmails[0], role });
    }
  };

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={500} stacked>
      <>
        <Modal.Header actions={<Modal.Header.CloseButtonAction onClick={api.onClose} />}>Invite Members</Modal.Header>

        <Modal.Body>
          <WorkspaceUI.InviteByEmail buttonLabel="Invite" onAddMembers={onAddMembers} />

          <Box mt={12}>
            <WorkspaceUI.TakenSeatsMessage />
          </Box>
        </Modal.Body>
      </>

      <>
        <Modal.Header
          actions={
            <System.IconButtonsGroup.Base>
              <System.IconButton.Base
                icon="arrowSpin"
                onClick={inviteLink.onRefetch}
                disabled={!inviteLink}
                iconProps={{ spin: !inviteLink }}
              />
            </System.IconButtonsGroup.Base>
          }
        >
          Invite via Magic Link
        </Modal.Header>

        <Modal.Body>
          <Box.Flex gap={12} fullWidth>
            <SelectInputGroup
              renderInput={(props) => (
                <Input {...props} disabled>
                  {() => <OverflowText display="block">{inviteLink.link || 'Loading...'}</OverflowText>}
                </Input>
              )}
            >
              {() => <Members.RoleSelect value={inviteLink.userRole} onChange={inviteLink.onChangeRole} />}
            </SelectInputGroup>

            <Button onClick={inviteLink.onCopy} disabled={!inviteLink.link} variant={Button.Variant.PRIMARY}>
              Copy
            </Button>
          </Box.Flex>
        </Modal.Body>
      </>
    </Modal>
  );
};

export default DoubleModal;
