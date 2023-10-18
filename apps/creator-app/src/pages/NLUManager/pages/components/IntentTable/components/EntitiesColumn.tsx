import * as Platform from '@voiceflow/platform-config';
import { Box, stopPropagation, TableTypes, Tag } from '@voiceflow/ui';
import * as Normal from 'normal-store';
import React from 'react';

import { useAllEntitiesByIDsSelector, useOnOpenEntityEditModal } from '@/hooks/entity.hook';

import EmptyDash from '../../../../components/EmptyDash';

const EntitiesColumn: React.FC<TableTypes.ItemProps<Platform.Base.Models.Intent.Model>> = ({ item }) => {
  const onOpenEntityEditModal = useOnOpenEntityEditModal();

  const entitiesIDs = React.useMemo(
    () =>
      Normal.denormalize(item.slots)
        .filter(({ required }) => required)
        .map((slot) => slot.id),
    [item.slots]
  );

  const entities = useAllEntitiesByIDsSelector({ ids: entitiesIDs });

  return (
    <Box.Flex gap={4}>
      {entities.length ? (
        <>
          {entities.map((entity) => (
            <Tag key={entity.id} color={entity.color} onClick={stopPropagation(() => onOpenEntityEditModal({ entityID: entity.id }))}>
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
