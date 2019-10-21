import React from 'react';

import ListManager from '@/components/ListManager';
import { setError } from '@/ducks/modal';
import { connect } from '@/hocs';
import { useManager } from '@/hooks';

import SlotSynonymControl from './SlotSynonymControl';

function SlotSynonymManager({ items, onChange }) {
  const slotSynonymManager = useManager(items, onChange);

  const validate = (value) => {
    if (value && items.includes(value)) {
      return 'Duplicate value in slot';
    }
  };
  const updateExample = (key) => (value) => {
    if (value) {
      slotSynonymManager.onUpdate(key)(value);
    } else {
      slotSynonymManager.onRemove(key)();
    }
  };

  return (
    <ListManager
      placeholder="Enter user reply"
      validate={validate}
      {...slotSynonymManager}
      onUpdate={updateExample}
      inputComponent={SlotSynonymControl}
    />
  );
}

const mapDispatchToProps = {
  setError,
};

export default connect(
  null,
  mapDispatchToProps
)(SlotSynonymManager);
