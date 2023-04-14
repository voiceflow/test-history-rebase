import * as Realtime from '@voiceflow/realtime-sdk';
import _sortBy from 'lodash/sortBy';
import React from 'react';

import * as SlotV2 from '@/ducks/slotV2';
import * as Tracking from '@/ducks/tracking';
import { useSelector } from '@/hooks/redux';
import { useModal } from '@/ModalsV2/hooks';
import Create from '@/ModalsV2/modals/NLU/Entity/Create';

export const useOrderedEntities = () => {
  const allSlots = useSelector(SlotV2.allSlotsSelector);

  return React.useMemo(() => _sortBy(allSlots, (slot) => slot.name?.toLowerCase()), [allSlots]);
};

export const useAddSlot = () => {
  const entityCreateModal = useModal(Create);

  const onAddSlot = React.useCallback((name: string) => {
    return entityCreateModal.open({ name, creationType: Tracking.CanvasCreationType.QUICKVIEW }).catch(() => null);
  }, []);

  return { onAddSlot };
};

export const useAreEntityInputsEmpty = (inputs: Realtime.SlotInput[]) =>
  React.useMemo(() => inputs.every(({ value, synonyms }) => !value.trim() && !synonyms.split(',').filter((s) => s.trim()).length), [inputs]);
