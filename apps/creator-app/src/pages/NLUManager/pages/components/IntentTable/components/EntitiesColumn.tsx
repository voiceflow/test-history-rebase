import * as Platform from '@voiceflow/platform-config';
import { Box, stopPropagation, TableTypes, Tag } from '@voiceflow/ui';
import * as Normal from 'normal-store';
import React from 'react';

import * as SlotV2 from '@/ducks/slotV2';
import { useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';

import EmptyDash from '../../../../components/EmptyDash';

const EntitiesColumn: React.FC<TableTypes.ItemProps<Platform.Base.Models.Intent.Model>> = ({ item }) => {
  const entityEditModal = ModalsV2.useModal(ModalsV2.NLU.Entity.Edit);

  const entitiesIDs = React.useMemo(
    () =>
      Normal.denormalize(item.slots)
        .filter(({ required }) => required)
        .map((slot) => slot.id),
    [item.slots]
  );

  const entities = useSelector(SlotV2.slotsByIDsSelector, { ids: entitiesIDs });

  return (
    <Box.Flex gap={4}>
      {entities.length ? (
        <>
          {entities.map((entity) => (
            <Tag key={entity.id} color={entity.color} onClick={stopPropagation(() => entityEditModal.openVoid({ slotID: entity.id }))}>
              {`{${entity.name}}`}
            </Tag>
          ))}
        </>
      ) : (
        <EmptyDash />
      )}
    </Box.Flex>
  );
};

export default EntitiesColumn;
