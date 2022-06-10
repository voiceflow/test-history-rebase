import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { addStep, removeNodePortRemapLinks } from '../utils';
import { createActiveDiagramReducer } from './utils';

const insertStepReducer = createActiveDiagramReducer(Realtime.node.insertStep, (state, { blockID, stepID, index, data, ports, nodePortRemaps }) => {
  addStep(state, (stepIDs) => Utils.array.insert(stepIDs, index, stepID), {
    blockID,
    stepID,
    data,
    ports,
  });
  removeNodePortRemapLinks(state, nodePortRemaps);
});

export default insertStepReducer;
