import React from 'react';

import Modal, { ModalHeader } from '@/components/LegacyModal';
import { MODALS } from '@/constants';
import { useModals } from '@/contexts/ModalsContext';

import SlotEdit from '.';

function SlotEditModal() {
  const { data, toggle, isOpened } = useModals(MODALS.SLOT_EDIT);

  const handleToggle = React.useCallback(() => {
    toggle(data);
  }, [data, toggle]);
  return (
    <Modal isOpen={isOpened} toggle={handleToggle}>
      <ModalHeader toggle={() => toggle(data)} header={data.isCreate ? 'NEW SLOT' : 'EDIT SLOT'} />
      <SlotEdit {...data} />
    </Modal>
  );
}

export default SlotEditModal;
