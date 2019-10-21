import React from 'react';

import CardManager from '@/components/CardManager';
import { addIntent, allIntentsSelector, removeIntent, updateIntent } from '@/ducks/intent';
import { connect } from '@/hocs';

import IntentInput from './components/IntentInput';

const IntentManager = ({ intents, addIntent, updateIntent, removeIntent }) => {
  return (
    <CardManager
      type="intent"
      label="Intents"
      addLabel="Add Intent"
      searchPlaceholder="Search Intents"
      items={intents}
      onAdd={(id, name) => addIntent(id, { id, name, inputs: [], open: true })}
      onUpdate={updateIntent}
      onRemove={removeIntent}
      formComponent={IntentInput}
    />
  );
};

const mapStateToProps = {
  intents: allIntentsSelector,
};

const mapDispatchToProps = {
  addIntent,
  updateIntent,
  removeIntent,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IntentManager);
