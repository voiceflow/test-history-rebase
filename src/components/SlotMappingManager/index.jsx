import React from 'react';

import Button from '@/componentsV2/Button';
import { findSlotsByIDsSelector } from '@/ducks/slot';
import { connect } from '@/hocs';
import { useManager } from '@/hooks';

import SlotMapping from './components/SlotMapping';

export const slotMappingFactory = () => ({
  variable: null,
  slot: null,
});

function SlotMappingManager({ items, slots, onChange }) {
  const { onAdd, mapManaged } = useManager(items, onChange, { factory: slotMappingFactory });

  return (
    <div>
      <label>Slot Mapping</label>
      {mapManaged((mapping, { key, onRemove, onUpdate }) => (
        <SlotMapping mapping={mapping} slots={slots} onRemove={onRemove} onUpdate={onUpdate} key={key} />
      ))}
      <Button className="mt-3 mb-3" variant="secondary" icon="plus" onClick={onAdd} fullWidth>
        Add Variable Map
      </Button>
    </div>
  );
}

const mapStateToProps = {
  slots: findSlotsByIDsSelector,
};

const mergeProps = ({ slots: findSlotsByIDs }, _, { slotIDs }) => ({
  slots: findSlotsByIDs(slotIDs),
});

export default connect(
  mapStateToProps,
  null,
  mergeProps
)(SlotMappingManager);
