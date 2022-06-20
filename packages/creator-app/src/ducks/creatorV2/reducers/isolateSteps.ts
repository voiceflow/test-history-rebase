import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReverter } from '@/ducks/utils';

import { stepIDsByBlockIDSelector } from '../selectors';
import { addStepReferences, orphanSteps } from '../utils';
import { addBlock } from './addBlock';
import { createActiveDiagramReducer, createDiagramInvalidator, createNodeRemovalInvalidators, DIAGRAM_INVALIDATORS } from './utils';

const isolateStepsReducer = createActiveDiagramReducer(
  Realtime.node.isolateSteps,
  (state, { sourceBlockID, blockID, blockPorts, blockCoords, blockName, stepIDs }) => {
    if (Normal.hasOne(state.nodes, blockID)) return;

    orphanSteps(
      state,
      () => {
        addBlock(state, { blockID, ports: blockPorts, coords: blockCoords, name: blockName });
        addStepReferences(state, (currentStepIDs) => [...currentStepIDs, ...stepIDs], { blockID, stepIDs });
      },
      { blockID: sourceBlockID, stepIDs }
    );
  }
);

export default isolateStepsReducer;

export const isolateStepsReverter = createReverter(
  Realtime.node.isolateSteps,

  ({ workspaceID, projectID, versionID, diagramID, sourceBlockID, blockID, stepIDs }, getState) => {
    const state = getState();
    const index = stepIDsByBlockIDSelector(state, { id: sourceBlockID }).indexOf(stepIDs[0]);
    const ctx = { workspaceID, projectID, versionID, diagramID };

    return Realtime.node.transplantSteps({
      ...ctx,
      sourceBlockID: blockID,
      targetBlockID: sourceBlockID,
      stepIDs,
      index,
      nodePortRemaps: [],
      removeSource: true,
    });
  },

  [
    ...DIAGRAM_INVALIDATORS,
    ...createNodeRemovalInvalidators<Realtime.node.IsolateStepsPayload>((origin, nodeID) => origin.stepIDs.includes(nodeID)),
    createDiagramInvalidator(
      Realtime.node.transplantSteps,
      (origin, subject) =>
        // both removing the same source
        !!subject.removeSource && origin.sourceBlockID === subject.sourceBlockID
    ),
  ]
);
