import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from '../utils';

const removeIntentStepsReducer = createReducer(Realtime.node.removeMany, (state, { diagramID, nodes }) => {
  if (!nodes.length) return;

  const nodeIDs = nodes.map((node) => node.stepID ?? node.blockID);
  const diagram = Normal.getOne(state, diagramID);

  if (diagram) {
    diagram.intentStepIDs = Utils.array.withoutValues(diagram.intentStepIDs, nodeIDs);
  }

  // clear any steps from the lookup
  const diagramIntentSteps = state.intentSteps[diagramID];
  const diagramGlobalIntents = state.globalIntentStepMap[diagramID] ?? {};

  if (diagramIntentSteps) {
    nodeIDs.forEach((nodeID) => {
      const intentData = diagramIntentSteps[nodeID];

      delete diagramIntentSteps[nodeID];

      if (intentData) {
        diagramGlobalIntents[intentData.intentID] = Utils.array.withoutValue(diagramGlobalIntents[intentData.intentID], nodeID);
      }
    });
  }
});

export default removeIntentStepsReducer;
