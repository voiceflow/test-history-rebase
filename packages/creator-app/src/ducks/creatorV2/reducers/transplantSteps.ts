import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { addStepReferences, orphanSteps, removeNodePortRemapLinks } from '../utils';
import { createActiveDiagramReducer } from './utils';

const transplantStepsReducer = createActiveDiagramReducer(
  Realtime.node.transplantSteps,
  (state, { sourceBlockID, targetBlockID, stepIDs, index, nodePortRemaps }) => {
    if (!Normal.hasMany(state.nodes, [sourceBlockID, targetBlockID, ...stepIDs])) return;

    orphanSteps(
      state,
      () => {
        addStepReferences(state, (currentStepIDs) => Utils.array.insertAll(currentStepIDs, index, stepIDs), { blockID: targetBlockID, stepIDs });
      },
      { blockID: sourceBlockID, stepIDs }
    );

    removeNodePortRemapLinks(state, nodePortRemaps);
  }
);

export default transplantStepsReducer;
