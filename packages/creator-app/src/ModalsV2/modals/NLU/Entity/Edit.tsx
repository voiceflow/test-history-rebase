import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, Dropdown, Modal, System, toast } from '@voiceflow/ui';
import React from 'react';

import * as SlotDuck from '@/ducks/slot';
import * as SlotV2 from '@/ducks/slotV2';
import * as Tracking from '@/ducks/tracking';
import { useDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';
import manager from '@/ModalsV2/manager';
import EditEntityForm from '@/pages/Canvas/components/EntityForm/EditEntityForm';

import { EntitySelectDropdown } from './components';
import { MAX_HEIGHT } from './constants';

export interface Props {
  slotID: string;
}

const Edit = manager.create<Props>('NLUEntityEdit', () => ({ api, type, opened, hidden, animated, slotID }) => {
  const getSlotByID = useSelector(SlotV2.getSlotByIDSelector);
  const [selectedSlot, setSelectedSlot] = React.useState<Realtime.Slot | null>(getSlotByID({ id: slotID }));

  const updateSelectedSlot = (newSlotID: string) => {
    const slot = getSlotByID({ id: newSlotID });
    setSelectedSlot(slot);
  };

  const deleteSlot = useDispatch(SlotDuck.deleteSlot);

  if (!selectedSlot) return null;

  const handleDeleteSlot = () => {
    deleteSlot(selectedSlot.id);
    toast.success(`Deleted slot ${selectedSlot.name}`);
    api.close();
  };

  return (
    <Modal type={type} maxWidth={450} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
      <Modal.Header
        border
        actions={
          <Dropdown
            options={[
              {
                key: 'delete',
                label: 'Delete',
                onClick: handleDeleteSlot,
              },
            ]}
          >
            {({ ref, onToggle, isOpen }) => (
              <System.IconButtonsGroup.Base mr={0}>
                <System.IconButton.Base ref={ref} icon="ellipsis" iconProps={{ size: 14 }} active={isOpen} onClick={onToggle} />
              </System.IconButtonsGroup.Base>
            )}
          </Dropdown>
        }
      >
        <EntitySelectDropdown onSelect={updateSelectedSlot} slotId={selectedSlot.id} />
        Edit Entity
      </Modal.Header>

      <Box maxHeight={MAX_HEIGHT} fullWidth overflow="auto">
        <EditEntityForm slotID={selectedSlot.id} creationType={Tracking.NLUEntityCreationType.NLU_QUICKVIEW} />
      </Box>

      <Modal.Footer gap={12}>
        <Button onClick={api.close}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
});

export default Edit;
