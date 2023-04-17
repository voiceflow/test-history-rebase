import React from 'react';

import EntityPromptSection from '@/components/EntityPromptSection';
import * as Intent from '@/ducks/intent';
import * as IntentV2 from '@/ducks/intentV2';
import * as SlotV2 from '@/ducks/slotV2';
import { useDispatch, useSelector } from '@/hooks';

interface EntityPromptFormProps {
  entityID: string;
  intentID: string;
  autogenerate: boolean;
}

const EntityPromptForm: React.FC<EntityPromptFormProps> = ({ entityID, intentID, autogenerate }) => {
  const intent = useSelector(IntentV2.intentByIDSelector, { id: intentID });
  const intentEntity = useSelector(IntentV2.intentSlotByIntentIDSlotIDSelector, { id: intentID, slotID: entityID });
  const intentEntityIDs = useSelector(IntentV2.slotsByIntentIDSelector, { id: intentID });
  const entity = useSelector(SlotV2.slotByIDSelector, { id: entityID });
  const entities = useSelector(SlotV2.slotsByIDsSelector, { ids: intentEntityIDs });

  const onChangeDialog = useDispatch(Intent.updateIntentSlotDialog, intentID, entityID);

  if (!entity || !intentEntity) return null;

  return (
    <EntityPromptSection
      entity={entity}
      prompts={intentEntity.dialog.prompt}
      entities={entities}
      onChange={(prompt) => onChangeDialog({ prompt })}
      intentName={intent?.name ?? ''}
      autogenerate={autogenerate}
      intentInputs={intent?.inputs ?? []}
    />
  );
};

export default EntityPromptForm;
