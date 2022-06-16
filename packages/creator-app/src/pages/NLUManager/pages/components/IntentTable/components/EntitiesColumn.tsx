import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, stopPropagation, TableTypes, Tag } from '@voiceflow/ui';
import * as Normal from 'normal-store';
import React from 'react';

import { ModalType } from '@/constants';
import * as SlotV2 from '@/ducks/slotV2';
import { useModals, useSelector } from '@/hooks';

import EmptyDash from '../../../../components/EmptyDash';

const EntitiesColumn: React.FC<TableTypes.ItemProps<Realtime.Intent>> = ({ item }) => {
  const entityEditModal = useModals(ModalType.ENTITY_EDIT);

  const entitiesIDs = React.useMemo(
    () =>
      Normal.denormalize<Realtime.IntentSlot>(item.slots)
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
