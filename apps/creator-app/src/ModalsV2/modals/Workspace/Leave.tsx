import { Box, Button, Modal } from '@voiceflow/ui';
import React from 'react';

import * as Workspace from '@/ducks/workspaceV2';
import { useDispatch } from '@/hooks';

import manager from '../../manager';

const Leave = manager.create('LeaveWorkspace', () => ({ api, type, opened, hidden, animated }) => {
  const leaveWorkspace = useDispatch(Workspace.leaveActiveWorkspace);

  const onLeaveWorkspace = () => {
    leaveWorkspace();
    api.close();
  };

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={400}>
      <Modal.Header actions={<Modal.Header.CloseButtonAction onClick={() => api.close()} />}>Leave workspace</Modal.Header>
      <Modal.Body centered>
        <Box pb={16}>
          Leaving this workspace will remove your access to it and all its content. Proceed with caution as this action cannot be undone. Are you sure
          you want to leave this workspace?
        </Box>
      </Modal.Body>
      <Modal.Footer gap={12}>
        <Button onClick={() => api.close()} variant={Button.Variant.TERTIARY} squareRadius>
          Cancel
        </Button>

        <Button squareRadius onClick={onLeaveWorkspace}>
          Leave
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default Leave;
