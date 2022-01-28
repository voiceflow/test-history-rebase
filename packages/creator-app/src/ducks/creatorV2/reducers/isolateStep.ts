import * as Realtime from '@realtime-sdk';
import { Utils } from '@voiceflow/common';
import * as Normal from 'normal-store';

import { addStepReferences, removeStepReferences } from '../utils';
import { addBlock } from './addBlock';
import { createActiveDiagramReducer } from './utils';

const isolateStepReducer = createActiveDiagramReducer(Realtime.node.isolateStep, (state, { blockID, blockPorts, blockOrigin, stepID }) => {
  if (Normal.hasOne(state.nodes, blockID)) return;
  if (!Normal.hasOne(state.nodes, stepID)) return;

  const prevBlockID = state.blockIDByStepID[stepID];

  if (!prevBlockID || !Normal.hasOne(state.nodes, prevBlockID)) return;

  removeStepReferences(state, { blockID: prevBlockID, stepID });
  addBlock(state, { blockID, ports: blockPorts, origin: blockOrigin });
  addStepReferences(state, (stepIDs) => Utils.array.append(stepIDs, stepID), { blockID, stepID });
});

export default isolateStepReducer;
