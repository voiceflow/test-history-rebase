import * as Platform from '@voiceflow/platform-config';
import { Box, Button, ButtonVariant, Modal, System } from '@voiceflow/ui';
import React from 'react';

import { TextEditorVariablesPopoverProvider } from '@/contexts/TextEditorVariablesPopoverContext';
import * as Tracking from '@/ducks/tracking';
import manager from '@/ModalsV2/manager';

import EntityPromptForm from '../components/EntityPromptForm';
import IntentForm from '../components/IntentForm';
import { useCreateIntent } from './hooks';

export interface NLUIntentCreateResult {
  id: string;
  inputs: Platform.Base.Models.Intent.Input[];
  intentID: string;
}
export interface NLUIntentCreateProps {
  name?: string;
  utterances?: string[];
  creationType?: Tracking.CanvasCreationType;
  utteranceCreationType?: Tracking.CanvasCreationType;
}

const Create = manager.create<NLUIntentCreateProps, NLUIntentCreateResult>(
  'NLUIntentCreate',
  () =>
    ({
      api,
      name: initialName = '',
      type,
      opened,
      hidden,
      animated,
      utterances,
      creationType = Tracking.CanvasCreationType.QUICKVIEW,
      closePrevented,
      utteranceCreationType = Tracking.CanvasCreationType.QUICKVIEW,
    }) => {
      const [entityPromptSlotID, setEntityPromptSlotID] = React.useState('');
      const [entityPromptAutogenerate, setEntityPromptAutogenerate] = React.useState(false);

      const [modalRef, setModalRef] = React.useState<HTMLDivElement | null>(null);

      const initialInputs = React.useMemo(() => utterances?.map((u) => ({ text: u })) ?? [], [utterances]);

      const { name, inputs, setName, create, setInputs, intentEntities, addRequiredSlot, updateSlotDialog, removeRequiredSlot } = useCreateIntent({
        initialName,
        creationType,
        initialInputs,
      });

      const onCreate = async () => {
        try {
          api.preventClose();

          const result = await create();

          api.resolve(result);
          api.enableClose();
          api.close();
        } catch {
          api.enableClose();
        }
      };

      const onEnterEntityPrompt = (slotID: string, { autogenerate = false }: { autogenerate?: boolean } = {}) => {
        setEntityPromptSlotID(slotID);
        setEntityPromptAutogenerate(autogenerate);
      };

      const onEntityPromptBack = () => {
        setEntityPromptSlotID('');
        setEntityPromptAutogenerate(false);
      };

      return (
        <Modal ref={setModalRef} type={type} maxWidth={450} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
          <Modal.Header border actions={<Modal.Header.CloseButtonAction onClick={api.close} />}>
            {entityPromptSlotID && (
              <System.IconButtonsGroup.Base mr={12}>
                <System.IconButton.Base icon="largeArrowLeft" onClick={() => onEntityPromptBack()} />
              </System.IconButtonsGroup.Base>
            )}

            <span>Create Intent</span>
          </Modal.Header>

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
                    utteranceCreationType={utteranceCreationType}
                    onIntentNameSuggested={setName}
                    withDescriptionSection={false}
                  />
                )}
              </Box>
            </TextEditorVariablesPopoverProvider>
          )}

          <Modal.Footer gap={12}>
            <Button variant={ButtonVariant.TERTIARY} squareRadius onClick={api.close}>
              Cancel
            </Button>

            <Button width={140} disabled={closePrevented} variant={ButtonVariant.PRIMARY} onClick={onCreate} isLoading={closePrevented}>
              Create Intent
            </Button>
          </Modal.Footer>
        </Modal>
      );
    }
);

export default Create;
