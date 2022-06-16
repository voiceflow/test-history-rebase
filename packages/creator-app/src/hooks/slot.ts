import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import _sortBy from 'lodash/sortBy';
import React from 'react';

import { FeatureFlag } from '@/config/features';
import { ModalType } from '@/constants';
import * as Slot from '@/ducks/slot';
import * as SlotV2 from '@/ducks/slotV2';
import { CanvasCreationType } from '@/ducks/tracking/constants';
import { useFeature } from '@/hooks/feature';
import { useModals } from '@/hooks/modals';
import { useDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';
import { useTrackingEvents } from '@/hooks/tracking';

export const useOrderedEntities = () => {
  const allSlots = useSelector(SlotV2.allSlotsSelector);

  return React.useMemo(() => _sortBy(allSlots, (slot) => slot.name?.toLowerCase()), [allSlots]);
};

export const useAddSlot = () => {
  const slotEditModal = useModals(ModalType.SLOT_EDIT);
  const entityCreateModal = useModals(ModalType.ENTITY_CREATE);

  const createSlot = useDispatch(Slot.createSlot);

  const IMM_MODALS_V2 = useFeature(FeatureFlag.IMM_MODALS_V2);
  const [trackingEvents] = useTrackingEvents();

  const onAddSlot = React.useCallback(
    (name: string) =>
      new Promise<Realtime.Slot | null>((resolve) => {
        if (IMM_MODALS_V2.isEnabled) {
          entityCreateModal.open({ name, onCreate: resolve, onClose: () => resolve(null) });
          return;
        }

        slotEditModal.toggle(
          {
            name,
            isCreate: true,
            onSave: async ({ type, name, color, inputs = [] }: Realtime.Slot) => {
              const id = Utils.id.cuid.slug();

              await createSlot(id, { id, type, name, color, inputs });
              resolve({ id, name, color, type, inputs });

              trackingEvents.trackEntityCreated({ creationType: CanvasCreationType.EDITOR });
              slotEditModal.close();
            },
          },
          () => resolve(null)
        );
      }),
    []
  );

  return { onAddSlot, slotEditOpen: slotEditModal.isInStack };
};
