import { Box, Button, ButtonVariant, Dropdown, IconButton, IconButtonVariant, toast } from '@voiceflow/ui';
import React from 'react';

import Modal, { ModalFooter } from '@/components/Modal';
import { MODAL_WIDTH_VARIANTS, MODAL_WIDTHS, ModalType } from '@/constants';
import * as SlotDuck from '@/ducks/slot';
import * as SlotV2 from '@/ducks/slotV2';
import * as Tracking from '@/ducks/tracking';
import { useDispatch, useModals, useSelector } from '@/hooks';

import EditEntityForm from './components/EntityForm/EditEntityForm';
import EntitySelectDropdown from './components/EntitySelectDropdown';
import { MAX_HEIGHT_CALC } from './constants';

const EditModal: React.OldFC = () => {
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
      maxWidth={MODAL_WIDTHS[MODAL_WIDTH_VARIANTS.SMALL]}
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
      <Box width="100%" overflow="auto" maxHeight={MAX_HEIGHT_CALC}>
        <EditEntityForm key={data.id} slotID={data.id} creationType={Tracking.NLUEntityCreationType.NLU_QUICKVIEW} />
      </Box>

      <ModalFooter justifyContent="flex-end">
        <Button variant={ButtonVariant.PRIMARY} onClick={close}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditModal;
