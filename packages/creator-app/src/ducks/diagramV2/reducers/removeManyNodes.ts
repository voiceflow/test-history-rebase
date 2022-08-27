import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const removeManyNodesReducer = createReducer(Realtime.node.removeMany, (state, { diagramID, nodes }) => {
  if (!nodes.length) return;

  const nodeIDs = nodes.map((node) => node.stepID ?? node.parentNodeID);
  const diagram = Normal.getOne(state, diagramID);

  if (diagram) {
    diagram.menuNodeIDs = Utils.array.withoutValues(diagram.menuNodeIDs, nodeIDs);
  }

  const diagramSharedNodes = state.sharedNodes[diagramID];
  const diagramGlobalIntents = state.globalIntentStepMap[diagramID];

  if (!diagramSharedNodes) return;

  nodeIDs.forEach((nodeID) => {
    const sharedNode = diagramSharedNodes[nodeID];

    delete diagramSharedNodes[nodeID];

    if (sharedNode?.type === Realtime.BlockType.INTENT && sharedNode.intentID && diagramGlobalIntents?.[sharedNode.intentID]) {
      diagramGlobalIntents[sharedNode.intentID] = Utils.array.withoutValue(diagramGlobalIntents[sharedNode.intentID], nodeID);
    }
  });
});

export default removeManyNodesReducer;
