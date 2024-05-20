/* eslint-disable no-param-reassign */
import { Utils } from '@voiceflow/common';
import { TriggerNodeItemType } from '@voiceflow/dtos';
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
    } else if (previousSharedNode?.type === Realtime.BlockType.TRIGGER || previousSharedNode?.type === Realtime.BlockType.START) {
      const triggers = previousSharedNode.type === Realtime.BlockType.TRIGGER ? previousSharedNode.items : previousSharedNode.triggers;

      triggers.forEach((item) => {
        if (item.type !== TriggerNodeItemType.INTENT || !item.resourceID) return;

        state.globalIntentStepMap[diagramID][item.resourceID] ??= [];
        state.globalIntentStepMap[diagramID][item.resourceID] = Utils.array.withoutValue(
          state.globalIntentStepMap[diagramID][item.resourceID],
          data.nodeID
        );
      });
    }

    addSharedNode(state, diagramID, nodeDataToSharedNode(data));
  });
});

export default updateManyNodesDataReducer;
