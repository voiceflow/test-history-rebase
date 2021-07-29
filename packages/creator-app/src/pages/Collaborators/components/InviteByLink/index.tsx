import { UserRole } from '@voiceflow/internal';
import { Button, ButtonVariant, Menu, MenuItem, toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import DropdownWithCaret from '@/components/DropdownWithCaret';
import * as Errors from '@/config/errors';
import { FeatureFlag } from '@/config/features';
import { EDITOR_SEAT_ROLES, ModalType } from '@/constants';
import * as RealtimeWorkspace from '@/ducks/realtimeV2/workspace';
import * as Session from '@/ducks/session';
import * as Workspace from '@/ducks/workspace';
import { useFeature, useModals, useRealtimeSelector, useSelector, useTrackingEvents, useWorkspaceUserRoleSelector } from '@/hooks';
import { Identifier } from '@/styles/constants';
import { copy } from '@/utils/clipboard';
import * as Sentry from '@/vendors/sentry';

import { Container, DropdownContainer } from './components';

const PermissionText = {
  [UserRole.EDITOR]: 'can edit',
  [UserRole.VIEWER]: 'can view',
  [UserRole.ADMIN]: 'can admin',
};

const inviteLimitMessage = (
  <span>
    No available editor seats on this workspace. Collaborators will be added to this workspace as viewers if no editor seats are created.
    <div style={{ color: '#5d9df5', float: 'right', marginTop: '5px' }}>Add Editor Seats</div>
  </span>
);

type ROLE_OPTIONS = UserRole.EDITOR | UserRole.VIEWER | UserRole.ADMIN;

const InviteByLinkFooter: React.FC = () => {
  const atomicActions = useFeature(FeatureFlag.ATOMIC_ACTIONS);

  const activeWorkspaceID = useSelector(Session.activeWorkspaceIDSelector);
  const numberOfSeatsV1 = useSelector(Workspace.workspaceNumberOfSeatsSelector);
  const numberOfSeatsRealtime = useRealtimeSelector((state) =>
    RealtimeWorkspace.workspaceNumberOfSeatsByIDSelector(state, { id: activeWorkspaceID })
  );
  const usedEditorSeatsV1 = useSelector(Workspace.usedEditorSeatsSelector);
  const usedEditorSeatsRealtime = useRealtimeSelector((state) =>
    RealtimeWorkspace.workspaceUsedEditorSeatsByIDSelector(state, { id: activeWorkspaceID })
  );
  const userRole = useWorkspaceUserRoleSelector();

  const numberOfSeats = atomicActions.isEnabled ? numberOfSeatsRealtime : numberOfSeatsV1;
  const usedEditorSeats = atomicActions.isEnabled ? usedEditorSeatsRealtime : usedEditorSeatsV1;

  const [linkInvitePermission, setLinkInvitePermission] = React.useState<ROLE_OPTIONS>(UserRole.EDITOR);
  const [inviteCode, setInviteCode] = React.useState('');
  const [inviteLink, setInviteLink] = React.useState('');
  const { open: openPaymentsModal } = useModals(ModalType.PAYMENT);
  const [trackingEvents] = useTrackingEvents();
  const projectID = useSelector(Session.activeProjectIDSelector)!;

  React.useEffect(() => {
    const getInviteLink = async () => {
      if (!activeWorkspaceID) {
        Sentry.error(Errors.noActiveWorkspaceID());
        toast.genericError();
        return;
      }

      setInviteCode(await client.workspace.getInviteLink(activeWorkspaceID, linkInvitePermission));
    };
    getInviteLink();
  }, [linkInvitePermission]);

  React.useEffect(() => {
    const { hostname, port } = window.location;
    const host = `${hostname}${port ? `:${port}` : ''}`;
    setInviteLink(`https://${host}/invite?invite_code=${encodeURIComponent(inviteCode)}`);
  }, [inviteCode]);

  const handleCopyLink = () => {
    const numberOfUsedEditorSeats = usedEditorSeats;
    toast.success('Link copied to your clipboard, this link expires in 72 hours.');

    if (numberOfUsedEditorSeats >= numberOfSeats! && EDITOR_SEAT_ROLES.includes(linkInvitePermission)) {
      toast.warn(inviteLimitMessage, {
        onClick: openPaymentsModal,
        delay: 1000,
      });
    }
    copy(inviteLink);

    trackingEvents.trackProjectInviteCollaboratorsCopy({ projectID });
  };

  const handlePermissionChange = (onToggle: () => void, permission: ROLE_OPTIONS) => {
    onToggle();
    setLinkInvitePermission(permission);
  };

  return (
    <Container>
      <DropdownContainer>
        <span>Anyone with link</span>
        <DropdownWithCaret
          padding="0px 7px"
          alwaysBlue
          menu={(onToggle: () => void) => (
            <Menu>
              <MenuItem onClick={() => handlePermissionChange(onToggle, UserRole.EDITOR)}>can edit</MenuItem>
              <MenuItem onClick={() => handlePermissionChange(onToggle, UserRole.VIEWER)}>can view</MenuItem>
              {userRole === UserRole.ADMIN && <MenuItem onClick={() => handlePermissionChange(onToggle, UserRole.ADMIN)}>can admin</MenuItem>}
            </Menu>
          )}
          text={PermissionText[linkInvitePermission]}
        />
      </DropdownContainer>
      <Button id={Identifier.COPY_INVITE_BUTTON} variant={ButtonVariant.PRIMARY} onClick={handleCopyLink}>
        <span>Copy Link</span>
      </Button>
    </Container>
  );
};

export default InviteByLinkFooter;
