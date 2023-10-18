import { Box, stopPropagation, TableTypes, Tag } from '@voiceflow/ui';
import React from 'react';

import { useAllEntitiesByIDsSelector, useOnOpenEntityEditModal } from '@/hooks/entity.hook';
import { NLUIntent } from '@/pages/NLUManager/types';

import { EmptyDash } from '../../../components';

const EntitiesColumn: React.FC<TableTypes.ItemProps<NLUIntent>> = ({ item }) => {
  const onOpenEntityEditModal = useOnOpenEntityEditModal();

  const entities = useAllEntitiesByIDsSelector({ ids: item.slots.allKeys });

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
