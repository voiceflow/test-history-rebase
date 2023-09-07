import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, stopPropagation, TableTypes, Tag } from '@voiceflow/ui';
import * as Normal from 'normal-store';
import React from 'react';

import * as SlotV2 from '@/ducks/slotV2';
import { useSelector } from '@/hooks';
import { useFeature } from '@/hooks/feature';
import { useEditEntityModal, useEntityEditModalV2 } from '@/ModalsV2/hooks';

import EmptyDash from '../../../../components/EmptyDash';

const EntitiesColumn: React.FC<TableTypes.ItemProps<Platform.Base.Models.Intent.Model>> = ({ item }) => {
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
