import React from 'react';

import CardManager from '@/components/CardManager';
import { LockedResourceOverlay } from '@/containers/CanvasV2/components/LockedEditorOverlay';
import * as Intent from '@/ducks/intent';
import * as Realtime from '@/ducks/realtime';
import { connect } from '@/hocs';

import IntentInput from './components/IntentInput';

const IntentManager = ({ intents, addIntent, updateIntent, removeIntent }) => (
  <>
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
    <LockedResourceOverlay type={Realtime.ResourceType.INTENTS} />
  </>
);

const mapStateToProps = {
  intents: Intent.allIntentsSelector,
};

const mapDispatchToProps = {
  addIntent: Intent.addIntent,
  updateIntent: Intent.updateIntent,
  removeIntent: Intent.removeIntent,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IntentManager);
