import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { addStepReferences, orphanSteps, removeNodePortRemapLinks } from '../utils';
import { addBlock } from './addBlock';
import { createActiveDiagramReducer } from './utils';

const isolateStepReducer = createActiveDiagramReducer(
  Realtime.node.isolateSteps,
  (state, { sourceBlockID, blockID, blockPorts, blockCoords, blockName, stepIDs, nodePortRemaps }) => {
    if (Normal.hasOne(state.nodes, blockID)) return;

    orphanSteps(
      state,
      () => {
        addBlock(state, { blockID, ports: blockPorts, coords: blockCoords, name: blockName });
        addStepReferences(state, (currentStepIDs) => [...currentStepIDs, ...stepIDs], { blockID, stepIDs });
      },
      { blockID: sourceBlockID, stepIDs }
    );

    removeNodePortRemapLinks(state, nodePortRemaps);
  }
);

export default isolateStepReducer;
