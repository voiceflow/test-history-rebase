import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, ButtonVariant } from '@voiceflow/ui';
import React from 'react';

import Modal, { ModalFooter } from '@/components/Modal';
import { ModalType } from '@/constants';
import * as SlotDuck from '@/ducks/slot';
import * as SlotV2 from '@/ducks/slotV2';
import { useDispatch, useModals, useSelector } from '@/hooks';

import EntityForm from './components/EntityForm';
import { MAX_ENTITY_MODAL_WIDTH } from './constants';

const CreateModal: React.FC = () => {
  const { close, data } = useModals<{ id: string; onCreate: (slot: Realtime.Slot) => void }>(ModalType.ENTITY_CREATE);
  const slotID = data.id;
  const slot = useSelector(SlotV2.slotByIDSelector, { id: slotID });
  const deleteSlot = useDispatch(SlotDuck.deleteSlot);

  const handleOnCreate = () => {
    slot && data.onCreate(slot);
    close();
  };

  const handleCancel = () => {
    deleteSlot(slotID);
    close();
  };

  return (
    <Modal maxWidth={MAX_ENTITY_MODAL_WIDTH} id={ModalType.ENTITY_CREATE} title="Create Entity" headerBorder>
      <Box width="100%" overflow="auto" maxHeight="calc(100vh - 220px)">
        <EntityForm slotID={slotID} />
      </Box>
      <ModalFooter justifyContent="flex-end">
        <Box>
          <Button onClick={handleCancel} variant={ButtonVariant.TERTIARY} squareRadius style={{ marginRight: '10px', display: 'inline-block' }}>
            Cancel
          </Button>
          <Button onClick={handleOnCreate} style={{ display: 'inline-block' }} variant={ButtonVariant.PRIMARY} squareRadius>
            Create Entity
          </Button>
        </Box>
      </ModalFooter>
    </Modal>
  );
};

export default CreateModal;
