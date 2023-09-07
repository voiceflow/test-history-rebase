import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, stopPropagation, TableTypes, Tag } from '@voiceflow/ui';
import React from 'react';

import * as SlotV2 from '@/ducks/slotV2';
import { useSelector } from '@/hooks';
import { useFeature } from '@/hooks/feature';
import { useEditEntityModal, useEntityEditModalV2 } from '@/ModalsV2/hooks';
import { NLUIntent } from '@/pages/NLUManager/types';

import { EmptyDash } from '../../../components';

const EntitiesColumn: React.FC<TableTypes.ItemProps<NLUIntent>> = ({ item }) => {
  const v2CMS = useFeature(Realtime.FeatureFlag.V2_CMS);

  const entityEditModal = useEditEntityModal();
  const entityEditModalV2 = useEntityEditModalV2();

  const onEditEntity = (entityID: string) => {
    if (v2CMS.isEnabled) {
      entityEditModalV2.openVoid({ entityID });
    } else {
      entityEditModal.openVoid({ slotID: entityID });
    }
  };

  const entities = useSelector(SlotV2.slotsByIDsSelector, { ids: item.slots.allKeys });

  return (
    <Box.Flex gap={4}>
      {entities.length ? (
        <>
          {entities.map((entity) => (
            <Tag key={entity.id} color={entity.color} onClick={stopPropagation(() => onEditEntity(entity.id))}>
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
