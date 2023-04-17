import { Box, Button, ButtonVariant, Dropdown, SectionV2, System, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import Modal, { ModalFooter } from '@/components/Modal';
import { MODAL_WIDTH_VARIANTS, MODAL_WIDTHS, ModalType } from '@/constants';
import { TextEditorVariablesPopoverProvider } from '@/contexts/TextEditorVariablesPopoverContext';
import * as Intent from '@/ducks/intent';
import * as IntentV2 from '@/ducks/intentV2';
import * as Tracking from '@/ducks/tracking';
import { useDispatch, useModals, useSelector } from '@/hooks';
import EntityPromptForm from '@/pages/Canvas/components/EntityPromptForm';

import IntentSelectDropdown from './components/components/IntentSelectDropdown';
import EditIntentForm from './components/IntentForm/EditIntentForm';

const EditModal: React.FC = () => {
  const { close, data, open, isInStack } = useModals<{ id: string; newUtterance?: string; utteranceCreationType: Tracking.CanvasCreationType }>(
    ModalType.INTENT_EDIT
  );

  const intent = useSelector(IntentV2.platformIntentByIDSelector, { id: data.id });
  const deleteIntent = useDispatch(Intent.deleteIntent);

  const [entityPromptSlotID, setEntityPromptSlotID] = React.useState('');
  const [entityPromptAutogenerate, setEntityPromptAutogenerate] = React.useState(false);

  const [modalRef, setModalRef] = React.useState<HTMLDivElement | null>(null);

  const onDeleteIntent = () => {
    deleteIntent(data.id);
    close();
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
    close();

    onEntityPromptBack();

    open({ id: intentID, utteranceCreationType: Tracking.CanvasCreationType.QUICKVIEW });
  };

  useDidUpdateEffect(() => {
    if (isInStack) return;

    onEntityPromptBack();
  }, [isInStack]);

  if (!intent) return null;

  return (
    <Modal
      ref={setModalRef}
      maxWidth={MODAL_WIDTHS[MODAL_WIDTH_VARIANTS.SMALL]}
      headerActions={
        !entityPromptSlotID && (
          <Dropdown options={[{ key: 'delete', label: 'Delete intent', onClick: onDeleteIntent }]}>
            {({ ref, onToggle, isOpen }) => (
              <System.IconButtonsGroup.Base mr={0}>
                <System.IconButton.Base ref={ref} icon="ellipsis" active={isOpen} onClick={onToggle} iconProps={{ size: 14 }} />
              </System.IconButtonsGroup.Base>
            )}
          </Dropdown>
        )
      }
      id={ModalType.INTENT_EDIT}
      title={
        <>
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
        </>
      }
      headerBorder
    >
      {!!modalRef && (
        <TextEditorVariablesPopoverProvider value={modalRef}>
          <Box key={data.id} width="100%" overflow="auto" maxHeight="calc(100vh - 220px)">
            {entityPromptSlotID ? (
              <EntityPromptForm intentID={data.id} entityID={entityPromptSlotID} autogenerate={entityPromptAutogenerate} />
            ) : (
              <EditIntentForm
                intentID={data.id}
                creationType={Tracking.IntentEditType.QUICKVIEW}
                withNameSection
                onEnterEntityPrompt={onEnterEntityPrompt}
                utteranceCreationType={data.utteranceCreationType}
                prefilledNewUtterance={data?.newUtterance || undefined}
                withDescriptionBottomBorder={false}
              />
            )}
          </Box>
        </TextEditorVariablesPopoverProvider>
      )}

      <ModalFooter justifyContent="flex-end">
        <Button variant={ButtonVariant.PRIMARY} onClick={close}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditModal;
