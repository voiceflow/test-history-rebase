import { Button, ButtonVariant, Modal } from '@voiceflow/ui';
import React from 'react';

import AssistantMembersList from '@/pages/DashboardV2/components/Assistant/MembersList';

import manager from '../../manager';
import * as S from './styles';

// FIXME: We don't have a list of assistant members yet, once we do, we need to use it here.

const AssistantAccessModal = manager.create('AssistantAccessModal', () => ({ api, type, opened, hidden, animated }) => {
  const [memberIDs, setMembers] = React.useState<number[]>([]);

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={500}>
      <Modal.Header>Manage Assistant Access</Modal.Header>

      <Modal.Body>
        <S.Body>
          <AssistantMembersList memberIDs={memberIDs} onChange={setMembers} />
        </S.Body>
      </Modal.Body>

      <Modal.Footer gap={10}>
        <Button variant={ButtonVariant.TERTIARY} squareRadius onClick={() => api.close()}>
          Cancel
        </Button>

        <Button variant={ButtonVariant.PRIMARY}>Invite & Pay</Button>
      </Modal.Footer>
    </Modal>
  );
});

export default AssistantAccessModal;
