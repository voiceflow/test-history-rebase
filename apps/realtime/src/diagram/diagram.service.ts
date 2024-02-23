import { Inject, Injectable } from '@nestjs/common';
import { BaseNode } from '@voiceflow/base-types';
import { LoguxService } from '@voiceflow/nestjs-logux';
import { DiagramEntity, DiagramNode, DiagramORM, ToJSON } from '@voiceflow/orm-designer';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { ObjectId } from 'bson';
import { Optional } from 'utility-types';

import { MutableService } from '@/common';
import { FlowAndDiagram } from '@/flow/flow.interface';

type PrimitiveDiagram = Omit<Optional<ToJSON<DiagramEntity>, '_id' | 'diagramID'>, 'id'>;

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

  private insertNewDiagramToDB = (data: PrimitiveDiagram): Omit<ToJSON<DiagramEntity>, 'id'> => {
    const _id = data._id ?? new ObjectId().toHexString();

    return {
      ...data,
      _id,
      diagramID: _id,
    };
  };

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

  public async createOneComponentWithDiagram(
    data: FlowAndDiagram,
    meta: { versionID: string; projectID: string; workspaceID: string; clientID: string; userID: number }
  ) {
    const diagram = this.insertNewDiagramToDB({
      ...Realtime.Utils.diagram.componentDiagramFactory(data.flow.name),
      ...data.diagram,
      versionID: meta.versionID,
      creatorID: meta.userID,
    });

    const result = await this.orm.createMany([diagram]);

    this.reloadSharedNodes(
      result.map((item) => item.toJSON()),
      meta
    );

    return result;
  }

  public async createOneEmptyComponent(
    name: string,
    meta: { versionID: string; projectID: string; workspaceID: string; clientID: string; userID: number }
  ) {
    const diagram = this.insertNewDiagramToDB({
      ...Realtime.Utils.diagram.componentDiagramFactory(name),
      versionID: meta.versionID,
      creatorID: meta.userID,
    });

    const result = await this.orm.createMany([diagram]);

    this.reloadSharedNodes(
      result.map((item) => item.toJSON()),
      meta
    );

    return result;
  }
}
