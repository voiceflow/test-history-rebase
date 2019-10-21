import React from 'react';

import CardManager from '@/components/CardManager';
import { allIntentsSelector } from '@/ducks/intent';
import { setError } from '@/ducks/modal';
import { activePlatformSelector } from '@/ducks/skill';
import { addSlot, allSlotsSelector, removeSlot, updateSlot } from '@/ducks/slot';
import { connect } from '@/hocs';
import { activeSlotTypes } from '@/store/selectors';

import SlotInput from './components/SlotInput';

function SlotManager({ slots, intents, addSlot, removeSlot, updateSlot, setError }) {
  const safeRemoveSlot = (id) => {
    const slotToIntentNames = intents.reduce((acc, intent) => {
      intent.inputs.forEach((input) =>
        input.slots.forEach((slot) => {
          acc[slot] = intent.name;
        })
      );

      return acc;
    }, {});

    if (id in slotToIntentNames) {
      setError(`Cannot remove slot as it is currently being used in an intent (${slotToIntentNames[id]})`);
    } else {
      removeSlot(id);
    }
  };

  return (
    <CardManager
      type="slots"
      label="Slots"
      addLabel="Add Slots"
      searchPlaceholder="Search Slots"
      items={slots}
      onAdd={(id, name) => addSlot(id, { id, name, inputs: [], open: true, selected: null })}
      onUpdate={updateSlot}
      onRemove={safeRemoveSlot}
      formComponent={SlotInput}
    />
  );
}

const mapStateToProps = {
  intents: allIntentsSelector,
  slotTypes: activeSlotTypes,
  platform: activePlatformSelector,
  slots: allSlotsSelector,
};

const mapDispatchToProps = {
  setError,
  addSlot,
  removeSlot,
  updateSlot,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SlotManager);
