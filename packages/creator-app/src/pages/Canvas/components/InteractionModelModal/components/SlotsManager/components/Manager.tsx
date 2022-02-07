import React from 'react';

import * as SlotDuck from '@/ducks/slot';
import * as SlotV2 from '@/ducks/slotV2';
import { useDispatch, useSelector } from '@/hooks';
import SlotEdit from '@/pages/Canvas/components/SlotEdit';
import { FadeLeftContainer } from '@/styles/animations';

export interface ManagerProps {
  id: string;
  removeSlot: (id: string) => void;
}

const SlotEditComponent = SlotEdit as React.FC<any>;

const Manager: React.FC<ManagerProps> = ({ id, removeSlot }) => {
  const slot = useSelector(SlotV2.slotByIDSelector, { id });
  const patchSlot = useDispatch(SlotDuck.patchSlot, id);

  return !slot ? null : (
    <FadeLeftContainer style={{ marginTop: 10 }}>
      <SlotEditComponent {...slot} key={slot.id} onSave={patchSlot} onRemove={removeSlot} isInteraction />
    </FadeLeftContainer>
  );
};

export default Manager;
