import { Box, Button, ButtonVariant, Dropdown, IconButton, IconButtonVariant, toast } from '@voiceflow/ui';
import React from 'react';

import Modal, { ModalFooter } from '@/components/Modal';
import { ModalType } from '@/constants';
import * as SlotDuck from '@/ducks/slot';
import * as SlotV2 from '@/ducks/slotV2';
import { useDispatch, useModals, useSelector } from '@/hooks';

import EntityForm from './components/EntityForm';
import EntitySelectDropdown from './components/EntitySelectDropdown';
import { MAX_ENTITY_MODAL_WIDTH } from './constants';

const EditModal: React.FC = () => {
  const { close, data } = useModals<{ id: string }>(ModalType.ENTITY_EDIT);
  const deleteSlot = useDispatch(SlotDuck.deleteSlot);
  const allSlotsMap = useSelector(SlotV2.slotMapSelector);

  const handleDeleteSlot = () => {
    const slot = allSlotsMap[data.id];
    deleteSlot(data.id);
    toast.success(`Deleted slot ${slot.name}`);
    close();
  };

  return (
    <Modal
      maxWidth={MAX_ENTITY_MODAL_WIDTH}
      id={ModalType.ENTITY_EDIT}
      headerActions={
        <Dropdown
          options={[
            {
              key: 'delete',
              label: 'Delete',
              onClick: handleDeleteSlot,
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
      title={
        <>
          <EntitySelectDropdown />
          Edit Entity
        </>
      }
      headerBorder
    >
      <Box width="100%" overflow="auto" maxHeight="calc(100vh - 220px)">
        <EntityForm slotID={data.id} />
      </Box>
      <ModalFooter justifyContent="flex-end">
        <Button variant={ButtonVariant.PRIMARY} squareRadius onClick={close}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditModal;
