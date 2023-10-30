import { Inject, Injectable } from '@nestjs/common';
import { BaseNode } from '@voiceflow/base-types';
import { DiagramEntity, DiagramNode, DiagramORM, ToJSON } from '@voiceflow/orm-designer';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { MutableService } from '@/common';

@Injectable()
export class DiagramService extends MutableService<DiagramORM> {
  private static sharedNodeMapper(node: DiagramNode): Realtime.diagram.sharedNodes.SharedNode | null {
    if (Realtime.Utils.typeGuards.isIntentDBNode(node)) {
      const global = !node.data.availability || node.data.availability === BaseNode.Intent.IntentAvailability.GLOBAL;

      return { type: Realtime.BlockType.INTENT, global, nodeID: node.nodeID, intentID: node.data.intent || null };
    }

    if (Realtime.Utils.typeGuards.isStartDBNode(node)) {
      return { type: Realtime.BlockType.START, name: node.data.label || '', nodeID: node.nodeID };
    }

    if (Realtime.Utils.typeGuards.isBlockDBNode(node)) {
      return { type: Realtime.BlockType.COMBINED, name: node.data.name, nodeID: node.nodeID };
    }

    return null;
  }

  static getAllSharedNodes(diagrams: ToJSON<DiagramEntity>[]): Realtime.diagram.sharedNodes.DiagramSharedNodeMap {
    const sharedNodes: Realtime.diagram.sharedNodes.DiagramSharedNodeMap = {};

    diagrams.forEach((diagram) => {
      const diagramSharedNode: Realtime.diagram.sharedNodes.SharedNodeMap = {};

      sharedNodes[diagram.diagramID] = diagramSharedNode;

      Object.values(diagram.nodes).forEach((node) => {
        const sharedNode = this.sharedNodeMapper(node);

        if (!sharedNode) return;

        diagramSharedNode[sharedNode.nodeID] = sharedNode;
      });
    });

    return sharedNodes;
  }

  constructor(
    @Inject(DiagramORM)
    protected readonly orm: DiagramORM
  ) {
    super();
  }

  public async findManyByVersionID(versionID: string) {
    return this.orm.findManyByVersionID(versionID);
  }
}
