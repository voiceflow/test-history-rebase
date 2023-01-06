import { Box, stopPropagation, TableTypes, Tag } from '@voiceflow/ui';
import React from 'react';

import { ModalType } from '@/constants';
import * as SlotV2 from '@/ducks/slotV2';
import { useModals, useSelector } from '@/hooks';
import { NLUIntent } from '@/pages/NLUManager/types';

import { EmptyDash } from '../../../components';

const EntitiesColumn: React.OldFC<TableTypes.ItemProps<NLUIntent>> = ({ item }) => {
  const entityEditModal = useModals(ModalType.ENTITY_EDIT);

  const entities = useSelector(SlotV2.slotsByIDsSelector, { ids: item.slots.allKeys });

  return (
    <Box.Flex gap={4}>
      {entities.length ? (
        <>
          {entities.map((entity) => (
            <Tag key={entity.id} color={entity.color} onClick={stopPropagation(() => entityEditModal.open({ id: entity.id }))}>
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
