import { Button, ButtonVariant, Modal } from '@voiceflow/ui';
import React from 'react';

import manager from '../../../manager';
import { MembersList } from './components';
import * as S from './styles';

const Members = manager.create('ProjectMembers', () => ({ api, type, opened, hidden, animated }) => {
  // FIXME: We don't have a list of assistant members yet, once we do, we need to use it here.
  const [memberIDs, setMembers] = React.useState<number[]>([]);

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={500}>
      <Modal.Header>Manage Assistant Access</Modal.Header>

      <Modal.Body>
        <S.Body>
          <MembersList memberIDs={memberIDs} onChange={setMembers} />
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

export default Members;
