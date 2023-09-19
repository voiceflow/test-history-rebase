import { Button, Dropdown, Modal, System, useLinkedState } from '@voiceflow/ui';
import { toast } from '@voiceflow/ui-next';
import React from 'react';

import * as SlotV2 from '@/ducks/slotV2';
import * as Tracking from '@/ducks/tracking';
import { useDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';
import manager from '@/ModalsV2/manager';
import EditEntityForm from '@/pages/Canvas/components/EntityForm/EditEntityForm';

import { EntityDropdown } from './components';

export interface Props {
  slotID: string;
}

const Edit = manager.create<Props>('NLUEntityEdit', () => ({ api, type, opened, hidden, animated, slotID }) => {
  const deleteSlot = useDispatch(SlotV2.deleteSlot);
  const getSlotByID = useSelector(SlotV2.getSlotByIDSelector);

  const [activeSlotID, setActiveSlotID] = useLinkedState<null | string>(slotID);

  const onDelete = () => {
    const slot = getSlotByID({ id: activeSlotID });

    if (!slot) return;

    deleteSlot(slot.id);
    toast.success(`Deleted slot ${slot.name}`);
    api.close();
  };

  return (
    <Modal type={type} maxWidth={450} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
      <Modal.Header
        border
        actions={
          <System.IconButtonsGroup.Base>
            <Dropdown options={[{ key: 'delete', label: 'Delete', onClick: onDelete }]}>
              {({ ref, onToggle, isOpen }) => (
                <System.IconButton.Base ref={ref} icon="ellipsis" iconProps={{ size: 14 }} active={isOpen} onClick={onToggle} />
              )}
            </Dropdown>

            <Modal.Header.CloseButton onClick={api.close} />
          </System.IconButtonsGroup.Base>
        }
      >
        <EntityDropdown onSelect={setActiveSlotID} slotID={activeSlotID} />
        Edit Entity
      </Modal.Header>

      {!!activeSlotID && <EditEntityForm slotID={activeSlotID} creationType={Tracking.NLUEntityCreationType.NLU_QUICKVIEW} />}

      <Modal.Footer gap={12} sticky>
        <Button onClick={api.close}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
});

export default Edit;
