import { Box, Button, ButtonVariant, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import Modal, { ModalFooter } from '@/components/Modal';
import { MODAL_WIDTH_VARIANTS, MODAL_WIDTHS, ModalType } from '@/constants';
import { TextEditorVariablesPopoverProvider } from '@/contexts';
import { useModals } from '@/hooks';
import IntentForm from '@/pages/Canvas/components/IntentModalsV2/components/IntentForm';
import { useCreateIntent } from '@/pages/Canvas/components/IntentModalsV2/CreateModal/hooks';

const CreateModal: React.FC = () => {
  const { close, data, isInStack } = useModals<{ id?: string; onCreate?: (id: string) => void; createName?: string }>(ModalType.INTENT_CREATE);

  const [modalRef, setModalRef] = React.useState<HTMLDivElement | null>(null);

  const {
    intentEntities,
    reset,
    cancel,
    creating,
    updateSlotDialog,
    onCreate,
    name,
    setName,
    inputs,
    setInputs,
    addRequiredSlot,
    removeRequiredSlot,
  } = useCreateIntent({
    initialName: data.createName,
    onCreate: (id: string) => {
      data.onCreate?.(id);
      close();
    },
  });

  useDidUpdateEffect(() => {
    if (isInStack) {
      reset();
      setName(data?.createName || '');
    } else {
      cancel();
    }
  }, [isInStack]);

  const handleCancel = async () => {
    cancel();
    close();
  };

  return (
    <Modal ref={setModalRef} maxWidth={MODAL_WIDTHS[MODAL_WIDTH_VARIANTS.SMALL]} id={ModalType.INTENT_CREATE} title="Create Intent" headerBorder>
      {!!modalRef && (
        <TextEditorVariablesPopoverProvider value={modalRef}>
          <Box width="100%" overflow="auto" maxHeight="calc(100vh - 220px)">
            <IntentForm
              removeRequiredSlot={removeRequiredSlot}
              addRequiredSlot={addRequiredSlot}
              inputs={inputs}
              setInputs={setInputs}
              name={name}
              setName={setName}
              withDescriptionSection={false}
              autofocus
              updateSlotDialog={updateSlotDialog}
              intentEntities={intentEntities}
            />
          </Box>
        </TextEditorVariablesPopoverProvider>
      )}

      <ModalFooter justifyContent="flex-end">
        <Button variant={ButtonVariant.TERTIARY} squareRadius onClick={handleCancel} style={{ marginRight: '10px' }}>
          Cancel
        </Button>
        <Button width={140} disabled={creating} variant={ButtonVariant.PRIMARY} squareRadius onClick={onCreate} isLoading={creating}>
          Create Intent
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CreateModal;
