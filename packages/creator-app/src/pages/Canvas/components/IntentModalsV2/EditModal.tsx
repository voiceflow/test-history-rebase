import { Box, Button, ButtonVariant, Dropdown, IconButton, IconButtonVariant } from '@voiceflow/ui';
import React from 'react';

import Modal, { ModalFooter } from '@/components/Modal';
import { ModalType } from '@/constants';
import * as Intent from '@/ducks/intent';
import * as IntentV2 from '@/ducks/intentV2';
import { useDispatch, useModals, useSelector } from '@/hooks';
import IntentSelectDropdown from '@/pages/Canvas/components/IntentModalsV2/components/components/IntentSelectDropdown';
import IntentForm from '@/pages/Canvas/components/IntentModalsV2/components/IntentForm';
import { INTENT_MODAL_WIDTH } from '@/pages/Canvas/components/IntentModalsV2/constants';

const EditModal: React.FC = () => {
  const { close, data } = useModals<{ id: string }>(ModalType.INTENT_EDIT);
  const { open: openIntentCreate } = useModals<{ id: string }>(ModalType.INTENT_CREATE);
  const deleteIntent = useDispatch(Intent.deleteIntent);

  const intent = useSelector(IntentV2.platformIntentByIDSelector, { id: data.id })!;
  if (!intent) return null;

  const onDeleteIntent = () => {
    deleteIntent(data.id);
    close();
  };
  return (
    <Modal
      maxWidth={INTENT_MODAL_WIDTH}
      headerActions={
        <Dropdown
          options={[
            {
              key: 'delete',
              label: 'Delete intent',
              onClick: onDeleteIntent,
            },
          ]}
        >
          {(ref, onToggle, isOpened) => (
            <IconButton
              style={{ marginRight: '0px' }}
              size={14}
              icon="ellipsis"
              variant={IconButtonVariant.BASIC}
              onClick={onToggle}
              activeClick={isOpened}
              ref={ref}
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
      <Box width="100%" overflow="auto" maxHeight="calc(100vh - 220px)">
        <IntentForm intent={intent} />
      </Box>
      <ModalFooter justifyContent="flex-end">
        <Button
          variant={ButtonVariant.TERTIARY}
          squareRadius
          onClick={() => {
            close();
            openIntentCreate({ id: data.id });
          }}
          style={{ marginRight: '10px' }}
        >
          Switch Mode
        </Button>
        <Button variant={ButtonVariant.PRIMARY} squareRadius onClick={close}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditModal;
