import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from '../utils';

const reorderIntentStepsReducer = createReducer(Realtime.diagram.reorderIntentSteps, (state, { diagramID, from, to }) => {
  const diagram = Normal.getOne(state, diagramID);

  if (diagram) {
    diagram.intentStepIDs = Utils.array.reorder(diagram.intentStepIDs, from, to);
  }
});

export default reorderIntentStepsReducer;
