import { UserRole } from '@voiceflow/internal';
import { Button, ButtonVariant, Menu, toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import DropdownWithCaret from '@/components/DropdownWithCaret';
import * as Errors from '@/config/errors';
import { Permission } from '@/config/permissions';
import { EDITOR_SEAT_ROLES, ModalType } from '@/constants';
import * as Session from '@/ducks/session';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useModals, usePermission, useSelector, useTrackingEvents } from '@/hooks';
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
  const activeWorkspaceID = useSelector(Session.activeWorkspaceIDSelector);
  const numberOfSeats = useSelector(WorkspaceV2.active.numberOfSeatsSelector);
  const usedEditorSeats = useSelector(WorkspaceV2.active.usedEditorSeatsSelector);
  const [canManageAdminCollaborators] = usePermission(Permission.MANAGE_ADMIN_COLLABORATORS);

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

  const handleCopyLink = async () => {
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
              <Menu.Item onClick={() => handlePermissionChange(onToggle, UserRole.EDITOR)}>can edit</Menu.Item>
              <Menu.Item onClick={() => handlePermissionChange(onToggle, UserRole.VIEWER)}>can view</Menu.Item>
              {canManageAdminCollaborators && <Menu.Item onClick={() => handlePermissionChange(onToggle, UserRole.ADMIN)}>can admin</Menu.Item>}
            </Menu>
          )}
          text={PermissionText[linkInvitePermission]}
        />
      </DropdownContainer>
      <Button id={Identifier.COPY_INVITE_BUTTON} variant={ButtonVariant.PRIMARY} onClick={handleCopyLink} disabled={!inviteCode} squareRadius>
        <span>Copy Link</span>
      </Button>
    </Container>
  );
};

export default InviteByLinkFooter;
