import React from 'react';

import CardManager from '@/components/CardManager';
import { LockedResourceOverlay } from '@/containers/CanvasV2/components/LockedEditorOverlay';
import * as Intent from '@/ducks/intent';
import * as Modal from '@/ducks/modal';
import * as Realtime from '@/ducks/realtime';
import * as Skill from '@/ducks/skill';
import * as Slot from '@/ducks/slot';
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
    <>
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
      <LockedResourceOverlay type={Realtime.ResourceType.SLOTS} />
    </>
  );
}

const mapStateToProps = {
  intents: Intent.allIntentsSelector,
  slotTypes: activeSlotTypes,
  platform: Skill.activePlatformSelector,
  slots: Slot.allSlotsSelector,
};

const mapDispatchToProps = {
  setError: Modal.setError,
  addSlot: Slot.addSlot,
  removeSlot: Slot.removeSlot,
  updateSlot: Slot.updateSlot,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SlotManager);
