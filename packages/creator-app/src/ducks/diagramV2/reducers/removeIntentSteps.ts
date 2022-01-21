import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const removeIntentStepsReducer = createReducer(Realtime.node.removeMany, (state, { diagramID, nodeIDs }) => {
  if (!nodeIDs.length) return;

  const diagram = Normal.getOne(state, diagramID);

  if (diagram) {
    diagram.intentStepIDs = Utils.array.withoutValues(diagram.intentStepIDs, nodeIDs);
  }

  // clear any steps from the lookup
  const diagramIntentSteps = state.intentSteps[diagramID];
  if (diagramIntentSteps) {
    nodeIDs.forEach((nodeID) => {
      delete diagramIntentSteps[nodeID];
    });
  }
});

export default removeIntentStepsReducer;
