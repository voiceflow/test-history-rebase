/* eslint-disable no-shadow */
import React from 'react';
import { Label } from 'reactstrap';

import * as Panel from '@/components/Panel';
import { SlotTag } from '@/components/VariableTag';
import { MODALS } from '@/constants';
import { useModals } from '@/contexts/ModalsContext';
import { allSlotsSelector, removeSlot, updateSlot } from '@/ducks/slot';
import { connect } from '@/hocs';

import VariableBox from './VariableBox';

const SlotCloud = ({ slots, updateSlot, removeSlot }) => {
  const { toggle: toggleSlotEdit, close: closeSlotEdit } = useModals(MODALS.SLOT_EDIT);

  const editSlot = ({ name, type, inputs, color, id }) => () => {
    toggleSlotEdit({
      name,
      type,
      color,
      inputs,
      id,
      onSave: (properties) => {
        updateSlot(id, { id, ...properties });
        closeSlotEdit();
      },
      onDelete: (id) => {
        removeSlot(id);
        closeSlotEdit();
      },
    });
  };

  return (
    <Panel.Section>
      <Label>Slots</Label>
      <VariableBox>
        {slots.map((slot) => (
          <SlotTag key={slot.name} color={slot.color} onClick={editSlot(slot)}>
            {slot.name}
          </SlotTag>
        ))}
      </VariableBox>
    </Panel.Section>
  );
};

const mapStateToProps = {
  slots: allSlotsSelector,
};

const mapDispatchToProps = {
  updateSlot,
  removeSlot,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SlotCloud);
