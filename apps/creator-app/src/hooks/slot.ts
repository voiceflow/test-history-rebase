import * as Realtime from '@voiceflow/realtime-sdk';
import _sortBy from 'lodash/sortBy';
import React from 'react';

import * as SlotV2 from '@/ducks/slotV2';
import * as Tracking from '@/ducks/tracking';
import { useFeature } from '@/hooks/feature';
import { useSelector } from '@/hooks/redux';
import { useCreateEntityModal, useEntityCreateModalV2 } from '@/ModalsV2/hooks/helpers';

export const useOrderedEntities = () => {
  const allSlots = useSelector(SlotV2.allSlotsSelector);

  return React.useMemo(() => _sortBy(allSlots, (slot) => slot.name?.toLowerCase()), [allSlots]);
};

export const useAddSlot = () => {
  const v2CMS = useFeature(Realtime.FeatureFlag.V2_CMS);

  const createEntityModal = useCreateEntityModal();
  const createEntityModalV2 = useEntityCreateModalV2();

  const onAddSlot = React.useCallback((name?: string) => {
    if (v2CMS.isEnabled) {
      return createEntityModalV2.open({ name, folderID: null }).catch(() => null);
    }

    return createEntityModal.open({ name, creationType: Tracking.CanvasCreationType.QUICKVIEW }).catch(() => null);
  }, []);

  return { onAddSlot };
};

export const useAreEntityInputsEmpty = (inputs: Realtime.SlotInput[]) =>
  React.useMemo(() => inputs.every(({ value, synonyms }) => !value.trim() && !synonyms.split(',').filter((s) => s.trim()).length), [inputs]);
