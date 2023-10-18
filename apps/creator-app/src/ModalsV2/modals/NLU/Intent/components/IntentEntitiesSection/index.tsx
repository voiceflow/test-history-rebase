import * as Platform from '@voiceflow/platform-config';
import { Box, PopperTypes, SectionV2 } from '@voiceflow/ui';
import * as Normal from 'normal-store';
import React from 'react';

import { useAllEntitiesSelector, useEntityMapSelector } from '@/hooks/entity.hook';
import IntentRequiredEntitiesSection from '@/pages/Canvas/components/IntentRequiredEntitiesSection';

import { OptionalEntity } from './components';

interface EntitiesSectionProps {
  onAddRequired: (slotID: string) => void;
  onEnterPrompt: (slotID: string, options?: { autogenerate: boolean }) => void;
  intentEntities: Normal.Normalized<Platform.Base.Models.Intent.Slot>;
  onRemoveRequired: (slotID: string) => void;
  addDropdownPlacement?: PopperTypes.Placement;
}

const EntitiesSection: React.FC<EntitiesSectionProps> = ({
  onAddRequired,
  onEnterPrompt,
  intentEntities,
  onRemoveRequired,
  addDropdownPlacement,
}) => {
  const entities = useAllEntitiesSelector();
  const entitiesMap = useEntityMapSelector();

  const [requiredEntities, optionalEntities] = React.useMemo(() => {
    const requiredEntities: Platform.Base.Models.Intent.Slot[] = [];
    const optionalEntities: Platform.Base.Models.Intent.Slot[] = [];

    Normal.denormalize(intentEntities).forEach((slot) => {
      if (!slot || !entitiesMap[slot.id]) return;

      if (slot.required) {
        requiredEntities.push(slot);
      } else {
        optionalEntities.push(slot);
      }
    });

    return [requiredEntities, optionalEntities];
  }, [intentEntities, entitiesMap]);

  const hasIntentEntities = !!requiredEntities.length || !!optionalEntities.length;

  return (
    <SectionV2
      header={
        <IntentRequiredEntitiesSection.Header
          entities={entities}
          boldTitle={hasIntentEntities}
          intentEntities={intentEntities}
          onAddRequired={onAddRequired}
          addDropdownPlacement={addDropdownPlacement}
        />
      }
    >
      {hasIntentEntities && (
        <SectionV2.Content bottomOffset={2}>
          {requiredEntities.map((entity) => (
            <IntentRequiredEntitiesSection.Item
              key={entity.id}
              entity={entitiesMap[entity.id]}
              onClick={() => onEnterPrompt(entity.id)}
              intentEntity={entity}
              onRemoveRequired={() => onRemoveRequired(entity.id)}
              onGeneratePrompt={() => onEnterPrompt(entity.id, { autogenerate: true })}
            />
          ))}

          {!!optionalEntities.length && (
            <Box.Flex mt={8} gap={[4, 8]} flexWrap="wrap">
              {optionalEntities.map((entity) => (
                <OptionalEntity key={entity.id} entity={entitiesMap[entity.id]} onClick={() => onAddRequired(entity.id)} />
              ))}
            </Box.Flex>
          )}
        </SectionV2.Content>
      )}
    </SectionV2>
  );
};

export default EntitiesSection;
