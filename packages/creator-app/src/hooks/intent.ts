import { Nullable, Nullish, Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { usePersistFunction } from '@voiceflow/ui';
import _sortBy from 'lodash/sortBy';
import * as Normal from 'normal-store';
import React from 'react';

import { ModalType } from '@/constants';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as SlotV2 from '@/ducks/slotV2';
import * as Tracking from '@/ducks/tracking';
import { isBuiltInIntent, validateIntentName } from '@/utils/intent';

import { ModalActions, useModals } from './modals';
import { useSelector } from './redux';

interface IntentData {
  intent: Nullable<Realtime.Intent>;
  intentEditModal: ModalActions<{ id: string; utteranceCreationType: Tracking.CanvasCreationType }>;
  intentIsBuiltIn: boolean;
  intentHasRequiredEntity: boolean;
  shouldDisplayRequiredEntities: boolean;
}

export const useOrderedIntents = () => {
  const allIntents = useSelector(IntentV2.allCustomIntentsSelector);

  return React.useMemo(() => _sortBy(allIntents, (intent) => intent.name.toLowerCase()), [allIntents]);
};

export const useIntent = (intentID: Nullish<string>): IntentData => {
  const intentEditModal = useModals<{ id: string; utteranceCreationType: Tracking.CanvasCreationType }>(ModalType.INTENT_EDIT);

  const intent = useSelector(IntentV2.platformIntentByIDSelector, { id: intentID });

  const intentIsBuiltIn = React.useMemo(() => !!intent && isBuiltInIntent(intent.id), [intent?.id]);

  const intentHasRequiredEntity = React.useMemo(
    () => !!intent?.slots && Normal.denormalize(intent.slots as Normal.Normalized<Realtime.IntentSlot>).some((entity) => entity.required),
    [intent?.slots]
  );

  const shouldDisplayRequiredEntities = !!intent && !intentIsBuiltIn && intentHasRequiredEntity;

  return {
    intent,
    intentEditModal,
    intentIsBuiltIn,
    intentHasRequiredEntity,
    shouldDisplayRequiredEntities,
  };
};

interface IntentNameProcessor {
  (name: string, intentID?: string): { error: null | string; formattedName: string };
}

export const useIntentNameProcessor = (): IntentNameProcessor => {
  const slots = useSelector(SlotV2.allSlotsSelector);
  const intents = useSelector(IntentV2.allIntentsSelector);
  const platform = useSelector(ProjectV2.active.platformSelector);

  return usePersistFunction((name: string, intentID?: string) => {
    const formattedName = Utils.string.removeTrailingUnderscores(name);

    const error = validateIntentName(formattedName, intentID ? intents.filter((intent) => intent.id !== intentID) : intents, slots, platform);

    return { error, formattedName };
  });
};
