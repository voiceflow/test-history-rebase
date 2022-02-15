import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { addStepReferences, orphanStep } from '../utils';
import { addBlock } from './addBlock';
import { createActiveDiagramReducer } from './utils';

const isolateStepReducer = createActiveDiagramReducer(Realtime.node.isolateStep, (state, { blockID, blockPorts, blockOrigin, stepID }) => {
  if (Normal.hasOne(state.nodes, blockID)) return;

  const sourceBlockID = state.blockIDByStepID[stepID];
  if (!sourceBlockID) return;

  orphanStep(
    state,
    () => {
      addBlock(state, { blockID, ports: blockPorts, origin: blockOrigin });
      addStepReferences(state, (stepIDs) => Utils.array.append(stepIDs, stepID), { blockID, stepID });
    },
    { blockID: sourceBlockID, stepID }
  );
});

export default isolateStepReducer;
