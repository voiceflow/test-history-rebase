import { Inject, Injectable } from '@nestjs/common';
import { BaseNode } from '@voiceflow/base-types';
import { LoguxService } from '@voiceflow/nestjs-logux';
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

  public async reloadSharedNodes(
    diagrams: ToJSON<DiagramEntity>[],
    meta: { versionID: string; projectID: string; workspaceID: string; clientID: string; userID: number }
  ): Promise<void> {
    const sharedNodes = DiagramService.getAllSharedNodes(diagrams);

    await this.logux.processAs(Realtime.diagram.sharedNodes.reload({ ...meta, sharedNodes }), meta);
  }

  constructor(
    @Inject(DiagramORM)
    protected readonly orm: DiagramORM,
    @Inject(LoguxService)
    private readonly logux: LoguxService
  ) {
    super();
  }

  public async findManyByVersionID(versionID: string) {
    return this.orm.findManyByVersionID(versionID);
  }

  public async deleteManyByVersionID(versionID: string) {
    return this.orm.deleteManyByVersionID(versionID);
  }

  public async createManyEmptyComponents(
    total: number,
    meta: { versionID: string; projectID: string; workspaceID: string; clientID: string; userID: number }
  ) {
    const diagrams = Array.from({ length: total }).map(() => ({
      ...Realtime.Utils.diagram.componentDiagramFactory(''),
      diagramID: '',
      versionID: meta.versionID,
      creatorID: meta.userID,
    }));
    console.log('W00T 3', diagrams);
    try {
      const result = await this.orm.createMany(diagrams);
      console.log('W00T 3.5', result);
      this.reloadSharedNodes(
        result.map((item) => item.toJSON()),
        meta
      );
      console.log('W00T 3.8');
      return result;
    } catch (e) {
      console.error('W00T err', e);
    }
  }

  // createManyComponents
  // This will call this.createMany
  // componentDiagramFactory
  // and the reloadSharedNodes
  // Realtime.Utils.diagram.componentDiagramFactory

  // same for duplicate
  // convert as well
}
