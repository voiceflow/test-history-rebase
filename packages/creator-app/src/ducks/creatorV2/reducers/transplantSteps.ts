import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { addStepReferences, orphanStep } from '../utils';
import { createActiveDiagramReducer } from './utils';

const transplantStepsReducer = createActiveDiagramReducer(
  Realtime.node.transplantSteps,
  (state, { sourceBlockID, targetBlockID, stepIDs, index }) => {
    if (!Normal.hasMany(state.nodes, [sourceBlockID, targetBlockID, ...stepIDs])) return;

    stepIDs.forEach((stepID, stepIndex) =>
      orphanStep(
        state,
        () => {
          addStepReferences(state, (stepIDs) => Utils.array.insert(stepIDs, index + stepIndex, stepID), { blockID: targetBlockID, stepID });
        },
        { blockID: sourceBlockID, stepID }
      )
    );
  }
);

export default transplantStepsReducer;
