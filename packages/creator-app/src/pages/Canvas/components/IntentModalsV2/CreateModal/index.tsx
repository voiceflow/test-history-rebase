import { Utils } from '@voiceflow/common';
import { Box, Button, ButtonVariant, IconButton, SectionV2, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import Modal, { ModalFooter } from '@/components/Modal';
import { MODAL_WIDTH_VARIANTS, MODAL_WIDTHS, ModalType } from '@/constants';
import { TextEditorVariablesPopoverProvider } from '@/contexts/TextEditorVariablesPopoverContext';
import * as Tracking from '@/ducks/tracking';
import { useModals } from '@/hooks';

import IntentForm from '../components/IntentForm';
import EntityPromptForm from './EntityPromptForm';
import { useCreateIntent } from './hooks';

const CreateModal: React.OldFC = () => {
  const { close, data, isInStack } = useModals<{
    id?: string;
    name?: string;
    onCreate?: (id: string) => void;
    creationType: Tracking.CanvasCreationType;
    utteranceCreationType: Tracking.CanvasCreationType;
    utterances?: string[];
  }>(ModalType.INTENT_CREATE);

  const [entityPromptSlotID, setEntityPromptSlotID] = React.useState('');
  const [entityPromptAutogenerate, setEntityPromptAutogenerate] = React.useState(false);

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
    intentEntities,
    addRequiredSlot,
    updateSlotDialog,
    removeRequiredSlot,
  } = useCreateIntent({
    onCreate: Utils.functional.chain(data.onCreate, close),
    initialName: data.name,
    creationType: data.creationType,
  });

  const onEnterEntityPrompt = (slotID: string, { autogenerate = false }: { autogenerate?: boolean } = {}) => {
    setEntityPromptSlotID(slotID);
    setEntityPromptAutogenerate(autogenerate);
  };

  const onEntityPromptBack = () => {
    setEntityPromptSlotID('');
    setEntityPromptAutogenerate(false);
  };

  useDidUpdateEffect(() => {
    if (isInStack) {
      reset();
      setName(data?.name || '');
    } else {
      onEntityPromptBack();
      cancel();
    }
  }, [isInStack]);

  React.useEffect(() => {
    if (!data.utterances) return;
    setInputs(data.utterances.map((u) => ({ text: u })));
  }, [data.utterances]);

  return (
    <Modal
      ref={setModalRef}
      maxWidth={MODAL_WIDTHS[MODAL_WIDTH_VARIANTS.SMALL]}
      id={ModalType.INTENT_CREATE}
      title={
        <>
          {entityPromptSlotID && (
            <SectionV2.ActionsContainer isLeft unit={0} offsetUnit={2.75}>
              <IconButton icon="largeArrowLeft" onClick={() => onEntityPromptBack()} variant={IconButton.Variant.BASIC} />
            </SectionV2.ActionsContainer>
          )}

          <span>Create Intent</span>
        </>
      }
      headerBorder
    >
      {!!modalRef && (
        <TextEditorVariablesPopoverProvider value={modalRef}>
          <Box width="100%" overflow="auto" maxHeight="calc(100vh - 220px)">
            {entityPromptSlotID ? (
              <EntityPromptForm
                entityID={entityPromptSlotID}
                intentName={name}
                autogenerate={entityPromptAutogenerate}
                intentInputs={inputs}
                onChangeDialog={updateSlotDialog}
                intentEntities={intentEntities}
              />
            ) : (
              <IntentForm
                name={name}
                inputs={inputs}
                setName={setName}
                autofocus
                setInputs={setInputs}
                creationType={Tracking.IntentEditType.IMM}
                intentEntities={intentEntities}
                addRequiredSlot={addRequiredSlot}
                removeRequiredSlot={removeRequiredSlot}
                onEnterEntityPrompt={onEnterEntityPrompt}
                utteranceCreationType={data.utteranceCreationType}
                onIntentNameSuggested={setName}
                withDescriptionSection={false}
              />
            )}
          </Box>
        </TextEditorVariablesPopoverProvider>
      )}

      <ModalFooter gap={10} justifyContent="flex-end">
        <Button variant={ButtonVariant.TERTIARY} squareRadius onClick={Utils.functional.chain(cancel, close)}>
          Cancel
        </Button>

        <Button width={140} disabled={creating} variant={ButtonVariant.PRIMARY} onClick={onCreate} isLoading={creating}>
          Create Intent
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CreateModal;
