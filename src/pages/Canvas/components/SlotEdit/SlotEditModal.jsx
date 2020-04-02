import React from 'react';

import Modal, { ModalHeader } from '@/components/LegacyModal';
import { ModalType } from '@/constants';
import { useModals } from '@/hooks';

import SlotEdit from '.';

function SlotEditModal() {
  const { data, toggle, isOpened } = useModals(ModalType.SLOT_EDIT);

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
