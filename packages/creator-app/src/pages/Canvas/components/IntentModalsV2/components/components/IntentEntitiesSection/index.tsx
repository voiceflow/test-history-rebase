import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, PopperTypes, SectionV2 } from '@voiceflow/ui';
import * as Normal from 'normal-store';
import React from 'react';

import * as SlotV2 from '@/ducks/slotV2';
import { useSelector } from '@/hooks';
import IntentRequiredEntitiesSection from '@/pages/Canvas/components/IntentRequiredEntitiesSection';

import { OptionalEntity, RequiredEntity } from './components';

interface EntitiesSectionProps {
  onAddRequired: (slotID: string) => void;
  intentEntities: Normal.Normalized<Realtime.IntentSlot>;
  onChangeDialog: (slotID: string, dialog: Partial<Realtime.IntentSlot['dialog']>) => void;
  onRemoveRequired: (slotID: string) => void;
  addDropdownPlacement?: PopperTypes.Placement;
}

const EntitiesSection: React.FC<EntitiesSectionProps> = ({
  onAddRequired,
  intentEntities,
  onChangeDialog,
  onRemoveRequired,
  addDropdownPlacement,
}) => {
  const entities = useSelector(SlotV2.allSlotsSelector);
  const entitiesMap = useSelector(SlotV2.slotMapSelector);

  const [requiredEntities, optionalEntities] = React.useMemo(() => {
    const requiredEntities: Realtime.IntentSlot[] = [];
    const optionalEntities: Realtime.IntentSlot[] = [];

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
            <RequiredEntity
              key={entity.id}
              entity={entitiesMap[entity.id]}
              entities={entities}
              intentEntity={entity}
              onChangeDialog={onChangeDialog}
              onRemoveRequired={onRemoveRequired}
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
