import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { FeatureFlag } from '@/config/features';
import { ModalType } from '@/constants';
import * as Slot from '@/ducks/slot';
import { CanvasCreationType } from '@/ducks/tracking/constants';
import { useFeature } from '@/hooks/feature';
import { useModals } from '@/hooks/modals';
import { useDispatch } from '@/hooks/realtime';
import { useTrackingEvents } from '@/hooks/tracking';
import { EntityModalMode } from '@/pages/Canvas/components/EntityModalV2';

// eslint-disable-next-line import/prefer-default-export
export const useAddSlot = () => {
  const { toggle: toggleSlotEdit, close: closeSlotEdit, isInStack: slotEditOpen } = useModals(ModalType.SLOT_EDIT);
  const createSlot = useDispatch(Slot.createSlot);
  const [trackingEvents] = useTrackingEvents();
  const IMM_MODALS_V2 = useFeature(FeatureFlag.IMM_MODALS_V2);

  const { open: openEntityModal } = useModals(ModalType.ENTITY);

  const onAddSlot = React.useCallback(
    (name: string) =>
      new Promise<Realtime.Slot | null>((resolve) => {
        if (IMM_MODALS_V2.isEnabled) {
          openEntityModal({ mode: EntityModalMode.CREATING });
          return;
        }
        toggleSlotEdit(
          {
            name,
            isCreate: true,
            onSave: async ({ type, name, color, inputs = [] }: Realtime.Slot) => {
              const id = Utils.id.cuid.slug();

              await createSlot(id, { id, type, name, color, inputs });
              resolve({ id, name, color, type, inputs });

              trackingEvents.trackEntityCreated({ creationType: CanvasCreationType.EDITOR });
              closeSlotEdit();
            },
          },
          () => resolve(null)
        );
      }),
    []
  );

  return { onAddSlot, slotEditOpen };
};
