import { Box, Button, ButtonVariant, Input, Modal, useSmartReducerV2 } from '@voiceflow/ui';
import React from 'react';

import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch } from '@/hooks';
import manager from '@/ModalsV2/manager';

const CreateNewAgentModal = manager.create<void, string>('CreateNewAgent', () => ({ api: modalAPI, type, opened, hidden, animated }) => {
  const [state, api] = useSmartReducerV2({
    agentName: '',
    error: false,
    loading: false,
  });

  const updateAgentName = useDispatch(VersionV2.updateInvocationName);

  const handleSubmit = async () => {
    api.loading.set(true);

    try {
      await updateAgentName(state.agentName);
      modalAPI.resolve(state.agentName);
      modalAPI.close();
    } finally {
      api.loading.set(false);
    }
  };

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={modalAPI.remove} maxWidth={392}>
      <Modal.Header>Create New Agent</Modal.Header>
      <Modal.Body>
        <Input autoFocus value={state.agentName} onChangeText={(value) => api.update({ agentName: value })} placeholder="Enter agent name" />
      </Modal.Body>

      <Modal.Footer>
        <Box mr={8}>
          <Button variant={ButtonVariant.TERTIARY} onClick={modalAPI.remove} squareRadius>
            Cancel
          </Button>
        </Box>
        <Button variant={ButtonVariant.PRIMARY} onClick={handleSubmit} disabled={!state.agentName} isLoading={state.loading}>
          Continue
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default CreateNewAgentModal;
