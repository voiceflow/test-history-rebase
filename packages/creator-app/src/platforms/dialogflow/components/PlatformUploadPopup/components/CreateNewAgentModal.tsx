import { Box, Button, ButtonVariant, Input, useSmartReducerV2 } from '@voiceflow/ui';
import React from 'react';

import Modal, { ModalBody, ModalFooter } from '@/components/Modal';
import { ModalType } from '@/constants';
import { useModals } from '@/hooks';

interface CreateNewAgentModalProps {
  onCancel: () => void;
  onSubmit: (agentName: string) => Promise<void>;
}

const CreateNewAgentModal: React.FC = () => {
  const {
    data: { onCancel, onSubmit },
  } = useModals<CreateNewAgentModalProps>(ModalType.DIALOGFLOW_CREATE_NEW_AGENT);

  const [state, api] = useSmartReducerV2({
    agentName: '',
    error: false,
    loading: false,
  });

  const handleCancel = () => {
    onCancel();
    api.update({ agentName: '' });
  };

  const handleSubmit = async () => {
    api.loading.set(true);

    try {
      await onSubmit(state.agentName);
      api.update({ agentName: '' });
    } finally {
      api.loading.set(false);
    }
  };

  return (
    <Modal id={ModalType.DIALOGFLOW_CREATE_NEW_AGENT} title="Create new agent">
      <ModalBody>
        <Input autoFocus value={state.agentName} onChangeText={(value) => api.update({ agentName: value })} placeholder="Enter agent name" />
      </ModalBody>

      <ModalFooter fullWidth>
        <Box mr={8}>
          <Button variant={ButtonVariant.TERTIARY} onClick={handleCancel}>
            Cancel
          </Button>
        </Box>
        <Button variant={ButtonVariant.PRIMARY} onClick={handleSubmit} disabled={!state.agentName} isLoading={state.loading}>
          Continue
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CreateNewAgentModal;
