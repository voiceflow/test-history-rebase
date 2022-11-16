import { Box, Button, ButtonVariant, Dropdown, IconButton, IconButtonVariant } from '@voiceflow/ui';
import React from 'react';

import Modal, { ModalFooter } from '@/components/Modal';
import { MODAL_WIDTH_VARIANTS, MODAL_WIDTHS, ModalType } from '@/constants';
import { TextEditorVariablesPopoverProvider } from '@/contexts';
import * as Intent from '@/ducks/intent';
import * as IntentV2 from '@/ducks/intentV2';
import * as Tracking from '@/ducks/tracking';
import { useDispatch, useModals, useSelector } from '@/hooks';
import IntentSelectDropdown from '@/pages/Canvas/components/IntentModalsV2/components/components/IntentSelectDropdown';
import EditIntentForm from '@/pages/Canvas/components/IntentModalsV2/components/IntentForm/EditIntentForm';

const EditModal: React.FC = () => {
  const { close, data } = useModals<{ id: string; newUtterance?: string; utteranceCreationType: Tracking.CanvasCreationType }>(ModalType.INTENT_EDIT);

  const intent = useSelector(IntentV2.platformIntentByIDSelector, { id: data.id });
  const deleteIntent = useDispatch(Intent.deleteIntent);

  const [modalRef, setModalRef] = React.useState<HTMLDivElement | null>(null);

  const onDeleteIntent = () => {
    deleteIntent(data.id);
    close();
  };

  if (!intent) return null;

  return (
    <Modal
      ref={setModalRef}
      maxWidth={MODAL_WIDTHS[MODAL_WIDTH_VARIANTS.SMALL]}
      headerActions={
        <Dropdown options={[{ key: 'delete', label: 'Delete intent', onClick: onDeleteIntent }]}>
          {(ref, onToggle, isOpened) => (
            <IconButton
              ref={ref}
              size={14}
              icon="ellipsis"
              style={{ marginRight: '0px' }}
              variant={IconButtonVariant.BASIC}
              onClick={onToggle}
              activeClick={isOpened}
            />
          )}
        </Dropdown>
      }
      id={ModalType.INTENT_EDIT}
      title={
        <>
          <IntentSelectDropdown />
          Edit Intent
        </>
      }
      headerBorder
    >
      {!!modalRef && (
        <TextEditorVariablesPopoverProvider value={modalRef}>
          <Box width="100%" overflow="auto" maxHeight="calc(100vh - 220px)">
            <EditIntentForm
              utteranceCreationType={data.utteranceCreationType}
              prefilledNewUtterance={data?.newUtterance || undefined}
              creationType={Tracking.IntentEditType.QUICKVIEW}
              withDescriptionBottomBorder={false}
              withNameSection
              intentID={data.id}
            />
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
