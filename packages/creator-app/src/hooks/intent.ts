import { Nullable, Nullish } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';
import React from 'react';

import { ModalType } from '@/constants';
import * as IntentV2 from '@/ducks/intentV2';
import { isBuiltInIntent } from '@/utils/intent';

import { ModalActions, useModals } from './modals';
import { useSelector } from './redux';

interface IntentData {
  intent: Nullable<Realtime.Intent>;
  intentEditModal: ModalActions<{ id: string }>;
  intentIsBuiltIn: boolean;
  intentHasRequiredEntity: boolean;
  shouldDisplayRequiredEntities: boolean;
}

export const useIntent = (intentID: Nullish<string>): IntentData => {
  const intentEditModal = useModals<{ id: string }>(ModalType.INTENT_EDIT);

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
