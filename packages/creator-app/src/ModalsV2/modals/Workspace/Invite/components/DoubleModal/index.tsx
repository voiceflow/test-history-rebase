import { UserRole } from '@voiceflow/internal';
import { Box, Button, Input, Members, Modal, OverflowText, System, toast } from '@voiceflow/ui';
import React from 'react';

import SelectInputGroup from '@/components/SelectInputGroup';
import WorkspaceUI from '@/components/Workspace';
import { LimitType } from '@/constants/limits';
import * as Session from '@/ducks/session';
import * as Workspace from '@/ducks/workspace';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, useGetPlanLimitedConfig, useOnAddSeats, useSelector, useSetup, useTrackingEvents } from '@/hooks';
import { VoidInternalProps } from '@/ModalsV2/types';
import { copyWithToast } from '@/utils/clipboard';
import { isEditorUserRole } from '@/utils/role';
import * as Sentry from '@/vendors/sentry';

const DoubleModal: React.FC<VoidInternalProps> = ({ api, type, opened, hidden, animated }) => {
  const projectID = useSelector(Session.activeProjectIDSelector)!;

  const numberOfSeats = useSelector(WorkspaceV2.active.numberOfSeatsSelector);
  const usedEditorSeats = useSelector(WorkspaceV2.active.usedEditorSeatsSelector);

  const [trackingEvents] = useTrackingEvents();
  const getEditorSeatLimit = useGetPlanLimitedConfig(LimitType.EDITOR_SEATS, { limit: numberOfSeats });

  const getWorkspaceInviteLink = useDispatch(Workspace.getWorkspaceInviteLink);

  const onAddSeats = useOnAddSeats();

  const [role, setRole] = React.useState<UserRole>(UserRole.EDITOR);
  const [inviteLink, setInviteLink] = React.useState('');

  const onFetchInviteLink = async (role: UserRole) => {
    try {
      setInviteLink('');

      const link = await getWorkspaceInviteLink(role);

      setInviteLink(link);
    } catch (error) {
      Sentry.error(error);

      toast.genericError();
    }
  };

  const onCopyLink = async () => {
    const isEditorRole = isEditorUserRole(role);
    const updatedEditorSeats = usedEditorSeats + (isEditorRole ? 1 : 0);
    const editorSeatLimit = getEditorSeatLimit({ value: updatedEditorSeats });

    copyWithToast(inviteLink, 'Link copied to your clipboard, this link expires in 72 hours.')();

    trackingEvents.trackProjectInviteCollaboratorsCopy({ projectID });

    if (editorSeatLimit) {
      toast.warn(
        <span>
          No available editor seats on this workspace. Collaborators will be added to this workspace as viewers if no editor seats are created.
          <div style={{ color: '#5d9df5', float: 'right', marginTop: '5px' }}>Add Editor Seats</div>
        </span>,
        { delay: 1000, onClick: () => onAddSeats() }
      );
    }
  };

  const onChangeRole = (role: UserRole) => () => {
    setRole(role);
    onFetchInviteLink(role);
  };

  useSetup(() => {
    onFetchInviteLink(role);
  });

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={500} stacked>
      <>
        <Modal.Header actions={<Modal.Header.CloseButtonAction onClick={() => api.close()} />}>Invite Members</Modal.Header>

        <Modal.Body>
          <WorkspaceUI.InviteByEmail buttonLabel="Invite" />

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
                onClick={() => onFetchInviteLink(role)}
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
                  {() => <OverflowText display="block">{inviteLink || 'Loading...'}</OverflowText>}
                </Input>
              )}
            >
              {() => <Members.RoleSelect value={role} onChange={onChangeRole} />}
            </SelectInputGroup>

            <Button onClick={onCopyLink} disabled={!inviteLink} variant={Button.Variant.PRIMARY}>
              Copy
            </Button>
          </Box.Flex>
        </Modal.Body>
      </>
    </Modal>
  );
};

export default DoubleModal;
