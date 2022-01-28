import * as Realtime from '@realtime-sdk';
import { Utils } from '@voiceflow/common';

import { addStep } from '../utils';
import { createActiveDiagramReducer } from './utils';

const insertStepReducer = createActiveDiagramReducer(Realtime.node.insertStep, (state, { blockID, stepID, index, data, ports }) => {
  addStep(state, (stepIDs) => Utils.array.insert(stepIDs, index, stepID), {
    blockID,
    stepID,
    data,
    ports,
  });
});

export default insertStepReducer;
