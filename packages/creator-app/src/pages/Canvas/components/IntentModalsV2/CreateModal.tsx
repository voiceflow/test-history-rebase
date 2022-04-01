import { Box, Button, ButtonVariant, toast } from '@voiceflow/ui';
import React from 'react';

import Modal, { ModalFooter } from '@/components/Modal';
import { ModalType } from '@/constants';
import { TextEditorVariablesPopoverProvider } from '@/contexts';
import * as Intent from '@/ducks/intent';
import * as IntentV2 from '@/ducks/intentV2';
import { useAsyncEffect, useDispatch, useModals, useSelector } from '@/hooks';
import IntentForm from '@/pages/Canvas/components/IntentModalsV2/components/IntentForm';
import { INTENT_MODAL_WIDTH } from '@/pages/Canvas/components/IntentModalsV2/constants';

const CreateModal: React.FC = () => {
  const { close, data, isInStack } = useModals<{ id?: string; onCreate?: (id: string) => void; createName?: string }>(ModalType.INTENT_CREATE);
  const deleteIntent = useDispatch(Intent.deleteIntent);
  const createIntent = useDispatch(Intent.createIntent);

  const [intentID, setIntentID] = React.useState<string | null>(null);
  const intent = useSelector(IntentV2.platformIntentByIDSelector, { id: intentID })!;

  const [modalRef, setModalRef] = React.useState<HTMLDivElement | null>(null);

  useAsyncEffect(async () => {
    if (!intentID && isInStack) {
      const nextIntentID = await createIntent({ name: data.createName });
      setIntentID(nextIntentID);
    }
    if (data.id && isInStack) {
      setIntentID(data.id);
    }
    if (!isInStack) {
      setIntentID(null);
    }
  }, [isInStack, intentID, data]);

  if (!intentID || !intent) return null;

  const warnNoUtterances = () => {
    toast.warn(`Your intent (${intent.name}) has no utterances. Add utterances to make your intent triggerable.`);
  };

  const onIntentCreate = () => {
    if (!intent.inputs.length) {
      warnNoUtterances();
    }
    data.onCreate?.(intentID);
    close();
  };

  const handleCancel = async () => {
    close();
    await deleteIntent(intentID);
  };

  return (
    <Modal ref={setModalRef} maxWidth={INTENT_MODAL_WIDTH} id={ModalType.INTENT_CREATE} title="Create Intent" headerBorder>
      {!!modalRef && (
        <TextEditorVariablesPopoverProvider value={modalRef}>
          <Box width="100%" overflow="auto" maxHeight="calc(100vh - 220px)">
            <IntentForm intentID={intentID} withDescriptionSection={false} autofocusUtterance />
          </Box>
        </TextEditorVariablesPopoverProvider>
      )}

      <ModalFooter justifyContent="flex-end">
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
