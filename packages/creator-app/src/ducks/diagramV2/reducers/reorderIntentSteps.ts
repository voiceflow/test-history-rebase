import * as Realtime from '@voiceflow/realtime-sdk';

import { reorder } from '@/utils/array';
import { safeGetNormalizedByKey } from '@/utils/normalized';

import { createReducer } from './utils';

const reorderIntentStepsReducer = createReducer(Realtime.diagram.reorderIntentSteps, (state, { diagramID, from, to }) => {
  const diagram = safeGetNormalizedByKey(state, diagramID);

  if (diagram) {
    diagram.intentStepIDs = reorder(diagram.intentStepIDs, from, to);
  }
});

export default reorderIntentStepsReducer;
