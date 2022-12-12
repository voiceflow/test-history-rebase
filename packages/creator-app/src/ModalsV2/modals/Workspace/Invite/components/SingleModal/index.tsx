import { Button, ButtonVariant, Modal } from '@voiceflow/ui';
import React from 'react';

import Workspace from '@/components/Workspace';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks';
import { VoidInternalProps } from '@/ModalsV2/types';

import * as S from './styles';

const SingleModal: React.FC<VoidInternalProps> = ({ api, type, opened, hidden, animated }) => {
  const members = useSelector(WorkspaceV2.active.membersSelector);

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={880}>
      <Modal.Header border>Invite Members to Workspace</Modal.Header>

      <S.InviteColumn>
        <Workspace.InviteByEmail />

        <S.MemberList>
          <Workspace.MemberList members={members} inset hideLastDivider={false} />
        </S.MemberList>

        <Workspace.TakenSeatsMessage small />
      </S.InviteColumn>

      <Modal.Footer gap={10} sticky>
        <Button variant={ButtonVariant.TERTIARY} squareRadius onClick={() => api.close()}>
          Cancel
        </Button>

        <Button variant={ButtonVariant.PRIMARY}>Invite & Pay</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SingleModal;
