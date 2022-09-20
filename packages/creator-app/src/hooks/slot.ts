import * as Realtime from '@voiceflow/realtime-sdk';
import _sortBy from 'lodash/sortBy';
import React from 'react';

import { ModalType } from '@/constants';
import * as SlotV2 from '@/ducks/slotV2';
import * as Tracking from '@/ducks/tracking';
import { useModals } from '@/hooks/modals';
import { useSelector } from '@/hooks/redux';

export const useOrderedEntities = () => {
  const allSlots = useSelector(SlotV2.allSlotsSelector);

  return React.useMemo(() => _sortBy(allSlots, (slot) => slot.name?.toLowerCase()), [allSlots]);
};

export const useAddSlot = () => {
  const slotEditModal = useModals(ModalType.SLOT_EDIT);
  const entityCreateModal = useModals(ModalType.ENTITY_CREATE);

  const onAddSlot = React.useCallback(
    (name: string) =>
      new Promise<Realtime.Slot | null>((resolve) => {
        entityCreateModal.open({ name, onCreate: resolve, onClose: () => resolve(null), creationType: Tracking.CanvasCreationType.QUICKVIEW });
      }),
    []
  );

  return { onAddSlot, slotEditOpen: slotEditModal.isInStack };
};
