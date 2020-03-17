import React from 'react';

import * as SlotDuck from '@/ducks/slot';
import { connect } from '@/hocs';
import SlotEdit from '@/pages/Canvas/components/SlotEdit';
import { FadeLeftContainer } from '@/styles/animations/FadeHorizontal';

import { Slot } from '../types';

export type ManagerProps = {
  id: string;
  slotsMap: Record<string, Slot>;
  removeSlot: (id: string) => void;
  updateSlot: (id: string, data: Partial<Slot>, patch?: boolean) => void;
};

const Manager: React.FC<ManagerProps> = ({ id, slotsMap, removeSlot, updateSlot }) => {
  const slot = slotsMap[id];

  return !slot ? null : (
    <FadeLeftContainer>
      <SlotEdit {...slot} key={slot.id} onSave={(data: Partial<Slot>) => updateSlot(id, { id, ...data })} onRemove={removeSlot} isInteraction />
    </FadeLeftContainer>
  );
};

const mapStateToProps = {
  slotsMap: SlotDuck.mapSlotsSelector,
};

const mapDispatchToProps = {
  updateSlot: SlotDuck.updateSlot,
};

export default connect(mapStateToProps, mapDispatchToProps)(Manager);
