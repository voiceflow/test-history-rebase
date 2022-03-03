import { Box, Button, ButtonVariant, toast } from '@voiceflow/ui';
import React from 'react';

import Modal, { ModalFooter } from '@/components/Modal';
import { ModalType } from '@/constants';
import * as Intent from '@/ducks/intent';
import * as IntentV2 from '@/ducks/intentV2';
import { useDispatch, useModals, useSelector } from '@/hooks';
import IntentForm from '@/pages/Canvas/components/IntentModalsV2/components/IntentForm';
import { INTENT_MODAL_WIDTH } from '@/pages/Canvas/components/IntentModalsV2/constants';

const CreateModal: React.FC = () => {
  const { close, data } = useModals<{ id: string }>(ModalType.INTENT_CREATE);
  const { open: openIntentEdit } = useModals<{ id: string }>(ModalType.INTENT_EDIT);
  const deleteIntent = useDispatch(Intent.deleteIntent);

  const intent = useSelector(IntentV2.platformIntentByIDSelector, { id: data.id })!;
  if (!intent) return null;

  const warnNoUtterances = () => {
    toast.warn(`Your intent (${intent.name}) has no utterances. Add utterances to make your intent triggerable.`);
  };

  const onIntentCreate = () => {
    if (!intent.inputs.length) {
      warnNoUtterances();
    }
    close();
  };
  const handleCancel = async () => {
    close();
    await deleteIntent(data.id);
  };

  return (
    <Modal maxWidth={INTENT_MODAL_WIDTH} id={ModalType.INTENT_CREATE} title="Create Intent" headerBorder>
      <Box width="100%" overflow="auto" maxHeight="calc(100vh - 220px)">
        <IntentForm intent={intent} />
      </Box>
      <ModalFooter justifyContent="flex-end">
        <Button
          variant={ButtonVariant.TERTIARY}
          squareRadius
          onClick={() => {
            close();
            openIntentEdit({ id: data.id });
          }}
          style={{ marginRight: '10px' }}
        >
          Switch Mode
        </Button>
        <Button variant={ButtonVariant.TERTIARY} squareRadius onClick={handleCancel} style={{ marginRight: '10px' }}>
          Cancel
        </Button>
        <Button variant={ButtonVariant.PRIMARY} squareRadius onClick={onIntentCreate}>
          Create Intent
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CreateModal;
