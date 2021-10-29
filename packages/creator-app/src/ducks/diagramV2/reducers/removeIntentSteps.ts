import * as Realtime from '@voiceflow/realtime-sdk';

import { withoutValues } from '@/utils/array';
import { safeGetNormalizedByKey } from '@/utils/normalized';

import { createReducer } from './utils';

const removeIntentStepsReducer = createReducer(Realtime.node.removeMany, (state, { diagramID, nodeIDs }) => {
  if (!nodeIDs.length) return;

  const diagram = safeGetNormalizedByKey(state, diagramID);

  if (diagram) {
    diagram.intentStepIDs = withoutValues(diagram.intentStepIDs, nodeIDs);
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
