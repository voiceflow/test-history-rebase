import * as Platform from '@voiceflow/platform-config';
import { PopperTypes, SectionV2 } from '@voiceflow/ui';
import * as Normal from 'normal-store';
import React from 'react';

import * as Designer from '@/ducks/designer';
import { useSelector } from '@/hooks';
import { useAllEntitiesSelector } from '@/hooks/entity.hook';

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
  const entities = useAllEntitiesSelector();
  const entitiesMap = useSelector(Designer.Entity.selectors.map);

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
