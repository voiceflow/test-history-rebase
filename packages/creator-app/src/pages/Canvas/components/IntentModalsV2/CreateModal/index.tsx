import { Utils } from '@voiceflow/common';
import { Box, Button, ButtonVariant, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import Modal, { ModalFooter } from '@/components/Modal';
import { MODAL_WIDTH_VARIANTS, MODAL_WIDTHS, ModalType } from '@/constants';
import { TextEditorVariablesPopoverProvider } from '@/contexts';
import * as Tracking from '@/ducks/tracking';
import { useModals } from '@/hooks';
import IntentForm from '@/pages/Canvas/components/IntentModalsV2/components/IntentForm';
import { useCreateIntent } from '@/pages/Canvas/components/IntentModalsV2/CreateModal/hooks';

const CreateModal: React.FC = () => {
  const { close, data, isInStack } = useModals<{
    id?: string;
    onCreate?: (id: string) => void;
    name?: string;
    utteranceCreationType: Tracking.CanvasCreationType;
    creationType: Tracking.CanvasCreationType;
  }>(ModalType.INTENT_CREATE);

  const [modalRef, setModalRef] = React.useState<HTMLDivElement | null>(null);

  const {
    name,
    reset,
    cancel,
    inputs,
    setName,
    creating,
    onCreate,
    setInputs,
    addRequiredSlot,
    intentEntities,
    updateSlotDialog,
    removeRequiredSlot,
  } = useCreateIntent({
    creationType: data.creationType,
    onCreate: Utils.functional.chain(data.onCreate, close),
    initialName: data.name,
  });

  useDidUpdateEffect(() => {
    if (isInStack) {
      reset();
      setName(data?.name || '');
    } else {
      cancel();
    }
  }, [isInStack]);

  return (
    <Modal ref={setModalRef} maxWidth={MODAL_WIDTHS[MODAL_WIDTH_VARIANTS.SMALL]} id={ModalType.INTENT_CREATE} title="Create Intent" headerBorder>
      {!!modalRef && (
        <TextEditorVariablesPopoverProvider value={modalRef}>
          <Box width="100%" overflow="auto" maxHeight="calc(100vh - 220px)">
            <IntentForm
              name={name}
              utteranceCreationType={data.utteranceCreationType}
              inputs={inputs}
              creationType={Tracking.IntentEditType.IMM}
              setName={setName}
              autofocus
              setInputs={setInputs}
              intentEntities={intentEntities}
              addRequiredSlot={addRequiredSlot}
              updateSlotDialog={updateSlotDialog}
              removeRequiredSlot={removeRequiredSlot}
              withDescriptionSection={false}
            />
          </Box>
        </TextEditorVariablesPopoverProvider>
      )}

      <ModalFooter gap={10} justifyContent="flex-end">
        <Button variant={ButtonVariant.TERTIARY} squareRadius onClick={Utils.functional.chain(cancel, close)}>
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
