import React from 'react';

import client from '@/client';
import Button, { ButtonVariant } from '@/components/Button';
import DropdownWithCaret from '@/components/DropdownWithCaret';
import Menu, { MenuItem } from '@/components/Menu';
import { toast } from '@/components/Toast';
import { ModalType, UserRole } from '@/constants';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { useModals } from '@/hooks';
import { ConnectedProps } from '@/types';
import { copy } from '@/utils/clipboard';

import { Container, DropdownContainer } from './components';

const PermissionText = {
  [UserRole.EDITOR]: 'can edit',
  [UserRole.VIEWER]: 'can view',
};

const inviteLimitMessage = (
  <span>
    No available editor seats on this workspace. Collaborators will be added to this workspace as viewers if no editor seats are created.
    <div style={{ color: '#5d9df5', float: 'right', marginTop: '5px' }}>Add Editor Seats</div>
  </span>
);

const InviteByLinkFooter: React.FC<{ noIcon?: boolean } & ConnectedSeatSummaryProps> = ({
  usedEditorSeats,
  numberOfSeats,
  activeWorkspaceID,
  noIcon = false,
}) => {
  const [linkInvitePermission, setLinkInvitePermission] = React.useState<UserRole.EDITOR | UserRole.VIEWER>(UserRole.EDITOR);
  const [inviteCode, setInviteCode] = React.useState('');
  const [inviteLink, setInviteLink] = React.useState('');
  const { open: openPaymentsModal } = useModals(ModalType.PAYMENT);

  React.useEffect(() => {
    const getInviteLink = async () => {
      setInviteCode(await client.workspace.getInviteLink(activeWorkspaceID!, linkInvitePermission));
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

    if (numberOfUsedEditorSeats >= numberOfSeats! && linkInvitePermission === UserRole.EDITOR) {
      toast.warn(inviteLimitMessage, {
        onClick: openPaymentsModal,
        delay: 1000,
      });
    }
    copy(inviteLink);
  };

  const handlePermissionChange = (onToggle: () => void, permission: UserRole.EDITOR | UserRole.VIEWER) => {
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
          menu={(onToggle: () => void) => {
            return (
              <Menu>
                <MenuItem onClick={() => handlePermissionChange(onToggle, UserRole.EDITOR)}>can edit</MenuItem>
                <MenuItem onClick={() => handlePermissionChange(onToggle, UserRole.VIEWER)}>can view</MenuItem>
              </Menu>
            );
          }}
          text={PermissionText[linkInvitePermission]}
        />
      </DropdownContainer>
      <Button variant={ButtonVariant.PRIMARY} icon={noIcon ? null : 'link'} onClick={handleCopyLink}>
        <span>Copy Invite Link</span>
      </Button>
    </Container>
  );
};

const mapStateToProps = {
  activeWorkspaceID: Workspace.activeWorkspaceIDSelector,
  numberOfSeats: Workspace.workspaceNumberOfSeatsSelector,
  usedEditorSeats: Workspace.usedEditorSeatsSelector,
};

type ConnectedSeatSummaryProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(InviteByLinkFooter) as React.FC<{ noIcon?: boolean }>;
