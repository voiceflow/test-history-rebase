import { Box } from '@voiceflow/ui';
import React from 'react';

import Modal from '@/components/Modal';
import { ModalType } from '@/constants';
import { useModals } from '@/hooks';

import SlotEdit from '.';

function SlotEditModal() {
  const { data } = useModals(ModalType.SLOT_EDIT);

  return (
    <Modal id={ModalType.SLOT_EDIT} title={data.isCreate ? 'NEW ENTITY' : 'EDIT ENTITY'}>
      <Box width="100%">
        <SlotEdit {...data} />
      </Box>
    </Modal>
  );
}

export default SlotEditModal;
