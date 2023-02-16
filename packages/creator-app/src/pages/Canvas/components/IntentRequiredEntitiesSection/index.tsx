import * as Platform from '@voiceflow/platform-config';
import { PopperTypes, SectionV2 } from '@voiceflow/ui';
import * as Normal from 'normal-store';
import React from 'react';

import * as SlotV2 from '@/ducks/slotV2';
import { useSelector } from '@/hooks';

import { Header, Item } from './components';

interface IntentRequiredEntitiesSectionProps {
  onEntityClick: (entityID: string) => void;
  onAddRequired: (entityID: string) => void;
  intentEntities: Normal.Normalized<Platform.Base.Models.Intent.Slot>;
  onGeneratePrompt: (entityID: string) => void;
  onRemoveRequired: (entityID: string) => void;
  addDropdownPlacement?: PopperTypes.Placement;
}

const IntentRequiredEntitiesSection: React.FC<IntentRequiredEntitiesSectionProps> = ({
  onAddRequired,
  onEntityClick,
  intentEntities,
  onGeneratePrompt,
  onRemoveRequired,
  addDropdownPlacement,
}) => {
  const entities = useSelector(SlotV2.allSlotsSelector);
  const entitiesMap = useSelector(SlotV2.slotMapSelector);

  const requiredEntities = React.useMemo(
    () => Normal.denormalize(intentEntities).filter((entity) => !!entity.required && !!entitiesMap[entity.id]),
    [intentEntities, entitiesMap]
  );

  return (
    <SectionV2
      header={
        <Header
          entities={entities}
          boldTitle={!!requiredEntities.length}
          onAddRequired={onAddRequired}
          intentEntities={intentEntities}
          addDropdownPlacement={addDropdownPlacement}
        />
      }
    >
      {!!requiredEntities.length && (
        <SectionV2.Content bottomOffset={2}>
          {requiredEntities.map((entity) => (
            <Item
              key={entity.id}
              entity={entitiesMap[entity.id]}
              onClick={() => onEntityClick(entity.id)}
              intentEntity={entity}
              onRemoveRequired={() => onRemoveRequired(entity.id)}
              onGeneratePrompt={() => onGeneratePrompt(entity.id)}
            />
          ))}
        </SectionV2.Content>
      )}
    </SectionV2>
  );
};

export default Object.assign(IntentRequiredEntitiesSection, {
  Item,
  Header,
});
