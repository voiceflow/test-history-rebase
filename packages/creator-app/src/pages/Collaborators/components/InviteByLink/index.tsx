import { datadogRum } from '@datadog/browser-rum';
import { Utils } from '@voiceflow/common';
import { UserRole } from '@voiceflow/internal';
import { Button, ButtonVariant, Menu, toast, useSetup } from '@voiceflow/ui';
import React from 'react';

import DropdownWithCaret from '@/components/DropdownWithCaret';
import { Permission } from '@/constants/permissions';
import * as Session from '@/ducks/session';
import * as Workspace from '@/ducks/workspace';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, usePermission, useSelector, useTrackingEvents } from '@/hooks';
import { usePaymentModal } from '@/ModalsV2/hooks';
import { Identifier } from '@/styles/constants';
import { copy } from '@/utils/clipboard';
import { isEditorUserRole } from '@/utils/role';

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

type LinkUserRole = UserRole.EDITOR | UserRole.VIEWER | UserRole.ADMIN;

const InviteByLinkFooter: React.FC = () => {
  const projectID = useSelector(Session.activeProjectIDSelector);
  const numberOfSeats = useSelector(WorkspaceV2.active.numberOfSeatsSelector);
  const usedEditorSeats = useSelector(WorkspaceV2.active.usedEditorSeatsSelector);
  const [canAddCollaborators] = usePermission(Permission.ADD_COLLABORATORS);
  const [canManageAdminCollaborators] = usePermission(Permission.MANAGE_ADMIN_COLLABORATORS);

  const getWorkspaceInviteLink = useDispatch(Workspace.getWorkspaceInviteLink);

  const paymentModal = usePaymentModal();
  const [trackingEvents] = useTrackingEvents();

  const [userRole, setUserRole] = React.useState<LinkUserRole>(UserRole.EDITOR);
  const [inviteLink, setInviteLink] = React.useState('');

  const onFetchInviteLink = async (role: UserRole) => {
    try {
      const link = await getWorkspaceInviteLink(role);

      setInviteLink(link);
    } catch (error) {
      datadogRum.addError(error);

      toast.genericError();
    }
  };

  const onCopyLink = async () => {
    const numberOfUsedEditorSeats = usedEditorSeats;

    toast.success('Link copied to your clipboard, this link expires in 72 hours.');

    if (numberOfUsedEditorSeats >= numberOfSeats && isEditorUserRole(userRole)) {
      toast.warn(inviteLimitMessage, { delay: 1000, onClick: () => paymentModal.openVoid({}) });
    }

    copy(inviteLink);

    trackingEvents.trackInvitationLinkCopy({ projectID });
  };

  const onChangeRole = (role: LinkUserRole) => () => {
    setUserRole(role);
    onFetchInviteLink(role);
  };

  useSetup(() => {
    onFetchInviteLink(userRole);
  });

  return (
    <Container>
      <DropdownContainer>
        <span>Anyone with link</span>
        <DropdownWithCaret
          text={PermissionText[userRole]}
          padding="0px 7px"
          disabled={!canAddCollaborators}
          alwaysBlue
          menu={(onToggle) => (
            <Menu>
              <Menu.Item onClick={Utils.functional.chainVoid(onToggle, onChangeRole(UserRole.EDITOR))}>can edit</Menu.Item>
              <Menu.Item onClick={Utils.functional.chainVoid(onToggle, onChangeRole(UserRole.VIEWER))}>can view</Menu.Item>

              {canManageAdminCollaborators && (
                <Menu.Item onClick={Utils.functional.chainVoid(onToggle, onChangeRole(UserRole.ADMIN))}>can admin</Menu.Item>
              )}
            </Menu>
          )}
        />
      </DropdownContainer>

      <Button id={Identifier.COPY_INVITE_BUTTON} variant={ButtonVariant.PRIMARY} onClick={onCopyLink} disabled={!inviteLink || !canAddCollaborators}>
        <span>Copy Link</span>
      </Button>
    </Container>
  );
};

export default InviteByLinkFooter;
