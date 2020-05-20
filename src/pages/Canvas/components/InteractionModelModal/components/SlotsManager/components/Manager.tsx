import React from 'react';

import * as SlotDuck from '@/ducks/slot';
import { connect } from '@/hocs';
import { Slot } from '@/models';
import SlotEdit from '@/pages/Canvas/components/SlotEdit';
import { FadeLeftContainer } from '@/styles/animations';
import { ConnectedProps } from '@/types';

export type ManagerProps = {
  id: string;
  removeSlot: (id: string) => void;
};

const SlotEditComponent = SlotEdit as React.FC<any>;

const Manager: React.FC<ManagerProps & ConnectedManagerProps> = ({ id, slotsMap, removeSlot, updateSlot }) => {
  const slot = slotsMap[id];

  return !slot ? null : (
    <FadeLeftContainer style={{ marginTop: 10 }}>
      <SlotEditComponent
        {...slot}
        key={slot.id}
        onSave={(data: Partial<Slot>) => updateSlot(id, { id, ...data })}
        onRemove={removeSlot}
        isInteraction
      />
    </FadeLeftContainer>
  );
};

const mapStateToProps = {
  slotsMap: SlotDuck.mapSlotsSelector,
};

const mapDispatchToProps = {
  updateSlot: SlotDuck.updateSlot,
};

type ConnectedManagerProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Manager) as React.FC<ManagerProps>;
