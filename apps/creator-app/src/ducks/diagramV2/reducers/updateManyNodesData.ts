/* eslint-disable no-param-reassign */
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { addSharedNode, createReducer, nodeDataToSharedNode } from './utils';

const updateManyNodesDataReducer = createReducer(Realtime.node.updateDataMany, (state, { diagramID, nodes }) => {
  if (!nodes.length) return;

  state.sharedNodes[diagramID] ??= {};
  state.globalIntentStepMap[diagramID] ??= {};

  nodes.forEach((data) => {
    const previousSharedNode = state.sharedNodes[diagramID][data.nodeID];

    if (previousSharedNode?.type === Realtime.BlockType.INTENT && previousSharedNode.intentID) {
      state.globalIntentStepMap[diagramID][previousSharedNode.intentID] ??= [];
      state.globalIntentStepMap[diagramID][previousSharedNode.intentID] = Utils.array.withoutValue(
        state.globalIntentStepMap[diagramID][previousSharedNode.intentID],
        data.nodeID
      );
    }

    addSharedNode(state, diagramID, nodeDataToSharedNode(data));
  });
});

export default updateManyNodesDataReducer;
