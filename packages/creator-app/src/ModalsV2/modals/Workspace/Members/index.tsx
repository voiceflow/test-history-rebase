import { Box, Button, ButtonVariant, Modal } from '@voiceflow/ui';
import React from 'react';

import Workspace from '@/components/Workspace';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks';

import manager from '../../../manager';
import * as S from './styles';

const Members = manager.create('WorkspaceMembersModal', () => ({ api, type, opened, hidden, animated }) => {
  const members = useSelector(WorkspaceV2.active.membersSelector);

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={880}>
      <Modal.Header border>Invite Members to Workspace</Modal.Header>

      <Box width="100%">
        <S.Body>
          <S.InviteColumn>
            <Workspace.InviteMember />

            <S.MemberList>
              <Workspace.MemberList members={members} inset hideLastDivider={false} />
            </S.MemberList>

            <Workspace.TakenSeatsMessage />
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

export default Members;
