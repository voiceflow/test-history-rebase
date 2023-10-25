import { Box, Button, Dropdown, Modal, SectionV2, System, toast, useDidUpdateEffect, useLinkedState } from '@voiceflow/ui';
import React from 'react';

import EntityPromptForm from '@/components/LegacyNLU/EntityPromptForm';
import { TextEditorVariablesPopoverProvider } from '@/contexts/TextEditorVariablesPopoverContext';
import * as IntentV2 from '@/ducks/intentV2';
import * as Tracking from '@/ducks/tracking';
import { useDispatch, useSelector } from '@/hooks';
import manager from '@/ModalsV2/manager';

import EditIntentForm from './components/EditIntentForm';
import IntentSelectDropdown from './components/IntentSelectDropdown';

export interface NLUIntentEditProps {
  intentID: string;
  newUtterance?: string;
  utteranceCreationType?: Tracking.CanvasCreationType;
}

const Edit = manager.create<NLUIntentEditProps>(
  'NLUIntentEdit',
  () =>
    ({ api, type, opened, hidden, animated, intentID, newUtterance, utteranceCreationType = Tracking.CanvasCreationType.QUICKVIEW }) => {
      const [activeIntentID, setActiveIntentID] = useLinkedState(intentID);

      const intent = useSelector(IntentV2.platformIntentByIDSelector, { id: activeIntentID });
      const deleteIntent = useDispatch(IntentV2.deleteIntent);

      const [entityPromptSlotID, setEntityPromptSlotID] = React.useState('');
      const [entityPromptAutogenerate, setEntityPromptAutogenerate] = React.useState(false);

      const [modalRef, setModalRef] = React.useState<HTMLDivElement | null>(null);

      const onDeleteIntent = async () => {
        try {
          api.preventClose();

          await deleteIntent(activeIntentID);

          api.enableClose();
          api.close();
        } catch {
          toast.error('Failed to delete intent');
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

      const onChangeIntent = (intentID: string) => {
        onEntityPromptBack();
        setActiveIntentID(intentID);
      };

      useDidUpdateEffect(() => onEntityPromptBack(), [activeIntentID]);

      if (!intent) return null;

      return (
        <Modal ref={setModalRef} type={type} maxWidth={450} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
          <Modal.Header
            border
            actions={
              <System.IconButtonsGroup.Base>
                {!entityPromptSlotID && (
                  <Dropdown options={[{ key: 'delete', label: 'Delete intent', onClick: onDeleteIntent }]}>
                    {({ ref, onToggle, isOpen }) => (
                      <System.IconButton.Base ref={ref} icon="ellipsis" active={isOpen} onClick={onToggle} iconProps={{ size: 14 }} />
                    )}
                  </Dropdown>
                )}

                <Modal.Header.CloseButton onClick={api.close} />
              </System.IconButtonsGroup.Base>
            }
          >
            {entityPromptSlotID ? (
              <SectionV2.ActionsContainer isLeft unit={0} offsetUnit={2.75}>
                <System.IconButtonsGroup.Base>
                  <System.IconButton.Base icon="largeArrowLeft" onClick={() => onEntityPromptBack()} />
                </System.IconButtonsGroup.Base>
              </SectionV2.ActionsContainer>
            ) : (
              <IntentSelectDropdown onChange={onChangeIntent} />
            )}

            <span>Edit Intent</span>
          </Modal.Header>

          {!!modalRef && (
            <TextEditorVariablesPopoverProvider value={modalRef}>
              <Box key={activeIntentID} width="100%" overflow="auto" maxHeight="calc(100vh - 220px)">
                {entityPromptSlotID ? (
                  <EntityPromptForm intentID={activeIntentID} entityID={entityPromptSlotID} autogenerate={entityPromptAutogenerate} />
                ) : (
                  <EditIntentForm
                    intentID={activeIntentID}
                    creationType={Tracking.IntentEditType.QUICKVIEW}
                    withNameSection
                    onEnterEntityPrompt={onEnterEntityPrompt}
                    utteranceCreationType={utteranceCreationType}
                    prefilledNewUtterance={newUtterance}
                    withDescriptionBottomBorder={false}
                  />
                )}
              </Box>
            </TextEditorVariablesPopoverProvider>
          )}

          <Modal.Footer gap={12}>
            <Button onClick={api.close}>Close</Button>
          </Modal.Footer>
        </Modal>
      );
    }
);

export default Edit;
