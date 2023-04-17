import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReverter } from '@/ducks/utils';

import { stepIDsByParentNodeIDSelector } from '../selectors';
import { addStepReferences, orphanSteps } from '../utils';
import { addActions } from './addActions';
import { addBlock } from './addBlock';
import { createActiveDiagramReducer, createDiagramInvalidator, createNodeRemovalInvalidators, DIAGRAM_INVALIDATORS } from './utils';

const isolateStepsReducer = createActiveDiagramReducer(
  Realtime.node.isolateSteps,
  (state, { stepIDs, parentNodeID, parentNodeData, sourceParentNodeID }) => {
    if (Normal.hasOne(state.nodes, parentNodeID)) return;

    orphanSteps(
      state,
      () => {
        if (parentNodeData.type === Realtime.BlockType.ACTIONS) {
          addActions(state, {
            ports: parentNodeData.ports,
            coords: parentNodeData.coords,
            actionsID: parentNodeID,
          });
        } else {
          addBlock(state, {
            name: parentNodeData.name,
            ports: parentNodeData.ports,
            coords: parentNodeData.coords,
            blockID: parentNodeID,
          });
        }
        addStepReferences(state, (currentStepIDs) => [...currentStepIDs, ...stepIDs], { parentNodeID, stepIDs });
      },
      { stepIDs, parentNodeID: sourceParentNodeID }
    );
  }
);

export default isolateStepsReducer;

export const isolateStepsReverter = createReverter(
  Realtime.node.isolateSteps,

  ({ workspaceID, projectID, versionID, domainID, diagramID, sourceParentNodeID, parentNodeID, stepIDs }, getState) => {
    const state = getState();
    const index = stepIDsByParentNodeIDSelector(state, { id: sourceParentNodeID }).indexOf(stepIDs[0]);
    const ctx = { workspaceID, projectID, versionID, domainID, diagramID };

    return Realtime.node.transplantSteps({
      ...ctx,
      sourceParentNodeID: parentNodeID,
      targetParentNodeID: sourceParentNodeID,
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
        !!subject.removeSource && origin.sourceParentNodeID === subject.sourceParentNodeID
    ),
  ]
);
