import { Box, stopPropagation, TableTypes, Tag } from '@voiceflow/ui';
import React from 'react';

import * as SlotV2 from '@/ducks/slotV2';
import { useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
import { NLUIntent } from '@/pages/NLUManager/types';

import { EmptyDash } from '../../../components';

const EntitiesColumn: React.FC<TableTypes.ItemProps<NLUIntent>> = ({ item }) => {
  const entityEditModal = ModalsV2.useModal(ModalsV2.NLU.Entity.Edit);

  const entities = useSelector(SlotV2.slotsByIDsSelector, { ids: item.slots.allKeys });

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
