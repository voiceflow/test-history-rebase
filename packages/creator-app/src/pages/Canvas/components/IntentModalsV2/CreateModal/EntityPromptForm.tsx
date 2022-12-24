import * as Platform from '@voiceflow/platform-config';
import * as Normal from 'normal-store';
import React from 'react';

import EntityPromptSection from '@/components/EntityPromptSection';
import * as SlotV2 from '@/ducks/slotV2';
import { useSelector } from '@/hooks';

interface EntityPromptFormProps {
  entityID: string;
  intentName: string;
  autogenerate: boolean;
  intentInputs: Platform.Base.Models.Intent.Input[];
  onChangeDialog: (slotID: string, dialog: Partial<Platform.Base.Models.Intent.SlotDialog>) => void;
  intentEntities: Normal.Normalized<Platform.Base.Models.Intent.Slot>;
}

const EntityPromptForm: React.FC<EntityPromptFormProps> = ({ entityID, intentName, autogenerate, intentInputs, intentEntities, onChangeDialog }) => {
  const intentEntity = Normal.getOne(intentEntities, entityID);

  const entity = useSelector(SlotV2.slotByIDSelector, { id: entityID });
  const entities = useSelector(SlotV2.slotsByIDsSelector, { ids: intentEntities.allKeys });

  if (!entity || !intentEntity) return null;

  return (
    <EntityPromptSection
      entity={entity}
      prompts={intentEntity.dialog.prompt}
      entities={entities}
      onChange={(prompt) => onChangeDialog(entityID, { prompt })}
      intentName={intentName}
      autogenerate={autogenerate}
      intentInputs={intentInputs}
    />
  );
};

export default EntityPromptForm;
