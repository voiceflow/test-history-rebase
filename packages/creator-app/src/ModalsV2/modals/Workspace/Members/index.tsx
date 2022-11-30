import { Box, Button, ButtonVariant, Modal } from '@voiceflow/ui';
import React from 'react';

import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks';
import InviteMember from '@/pages/DashboardV2/components/Workspace/InviteMember';
import WorkspaceMembersList from '@/pages/DashboardV2/components/Workspace/MemberList';
import TakenSeatsMessage from '@/pages/DashboardV2/components/Workspace/TakenSeatsMessage';

import manager from '../../../manager';
import * as S from './styles';

const WorkspaceMembersModal = manager.create('WorkspaceMembersModal', () => ({ api, type, opened, hidden, animated }) => {
  const members = useSelector(WorkspaceV2.active.membersSelector);

  return (
    <Modal
      type={type}
      opened={opened}
      hidden={hidden}
      animated={animated}
      onExited={api.remove}
      maxWidth={880}
      className="vf-modal--workspace-members"
    >
      <Modal.Header border>Invite Members to Workspace</Modal.Header>

      <Box width="100%">
        <S.Body>
          <S.InviteColumn>
            <InviteMember />

            <S.MemberList>
              <WorkspaceMembersList members={members} inset hideLastDivider={false} />
            </S.MemberList>
            <TakenSeatsMessage />
          </S.InviteColumn>
        </S.Body>

        <Modal.Footer gap={10}>
          <Button variant={ButtonVariant.TERTIARY} squareRadius onClick={() => api.close()}>
            Cancel
          </Button>

          <Button variant={ButtonVariant.PRIMARY}>Invite & Pay</Button>
        </Modal.Footer>
      </Box>
    </Modal>
  );
});

export default WorkspaceMembersModal;
