import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, BoxFlex, stopPropagation, Tag } from '@voiceflow/ui';
import React from 'react';

import { ModalType } from '@/constants';
import * as SlotV2 from '@/ducks/slotV2';
import { useModals, useSelector } from '@/hooks';
import { EmptyDash } from '@/pages/NLUManager/components';

interface EntitiesProps {
  flex: number;
  requiredSlots: Realtime.IntentSlot[];
}

const Entities: React.FC<EntitiesProps> = ({ flex, requiredSlots }) => {
  const allSlotsMap = useSelector(SlotV2.slotMapSelector);
  const { open: openEntityEditModal } = useModals(ModalType.ENTITY_EDIT);

  return (
    <Box flex={flex}>
      {requiredSlots.length ? (
        <>
          {requiredSlots.map((slot) => {
            const slotData = allSlotsMap[slot.id];
            return slotData ? (
              <>
                <Tag key={slotData.id} color={slotData.color} onClick={stopPropagation(() => openEntityEditModal({ id: slotData.id }))}>
                  {`{${slotData.name}}`}
                </Tag>{' '}
              </>
            ) : null;
          })}
        </>
      ) : (
        <BoxFlex alignItems="center" height="100%">
          <EmptyDash />
        </BoxFlex>
      )}
    </Box>
  );
};

export default Entities;
