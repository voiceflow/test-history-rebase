import { BaseModels, BaseNode } from '@voiceflow/base-types';
import { AnyRecord } from '@voiceflow/common';
import { Diagram } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';

const sharedNodeMapper = (
  node: BaseModels.BaseDiagramNode<AnyRecord>
): Realtime.diagram.sharedNodes.SharedNode | null => {
  if (Realtime.Utils.typeGuards.isIntentDBNode(node)) {
    const global = !node.data.availability || node.data.availability === BaseNode.Intent.IntentAvailability.GLOBAL;

    return { type: Realtime.BlockType.INTENT, global, nodeID: node.nodeID, intentID: node.data.intent || null };
  }

  if (Realtime.Utils.typeGuards.isTriggerDBNode(node)) {
    return { type: Realtime.BlockType.TRIGGER, nodeID: node.nodeID, items: node.data.items };
  }

  if (Realtime.Utils.typeGuards.isStartDBNode(node)) {
    return {
      type: Realtime.BlockType.START,
      name: node.data.label || '',
      nodeID: node.nodeID,
      triggers: node.data.triggers ?? [],
    };
  }

  if (Realtime.Utils.typeGuards.isBlockDBNode(node)) {
    return { type: Realtime.BlockType.COMBINED, name: node.data.name, nodeID: node.nodeID };
  }

  return null;
};

export const getSharedNodes = (diagrams: Diagram[]): Realtime.diagram.sharedNodes.DiagramSharedNodeMap => {
  const sharedNodes: Realtime.diagram.sharedNodes.DiagramSharedNodeMap = {};

  diagrams.forEach((diagram) => {
    const diagramSharedNode: Realtime.diagram.sharedNodes.SharedNodeMap = {};

    sharedNodes[diagram.diagramID] = diagramSharedNode;

    Object.values(diagram.nodes).forEach((node) => {
      const sharedNode = sharedNodeMapper(node);

      if (!sharedNode) return;

      diagramSharedNode[sharedNode.nodeID] = sharedNode;
    });
  });

  return sharedNodes;
};
