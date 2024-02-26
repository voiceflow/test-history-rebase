/* eslint-disable no-return-await */
import { Inject, Injectable } from '@nestjs/common';
import { BaseNode } from '@voiceflow/base-types';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import { DiagramEntity, DiagramNode, DiagramORM, ToJSON } from '@voiceflow/orm-designer';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { ObjectId } from 'bson';

import { EntitySerializer, MutableService } from '@/common';

import { DiagramCreateData } from './flow.interface';

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

  private async reloadSharedNodes(
    diagrams: ToJSON<DiagramEntity>[],
    meta: { environmentID: string; assistantID: string; workspaceID: string; clientID: string; userID: number }
  ): Promise<void> {
    const sharedNodes = DiagramService.getAllSharedNodes(diagrams);
    const transformedMeta = {
      versionID: meta.environmentID,
      workspaceID: meta.workspaceID,
      projectID: meta.assistantID,
      clientID: meta.clientID,
      userID: meta.userID,
    };

    await this.logux.processAs(Realtime.diagram.sharedNodes.reload({ ...transformedMeta, sharedNodes }), transformedMeta);
  }

  constructor(
    @Inject(DiagramORM)
    protected readonly orm: DiagramORM,
    @Inject(LoguxService)
    private readonly logux: LoguxService,
    @Inject(EntitySerializer)
    protected readonly entitySerializer: EntitySerializer
  ) {
    super();
  }

  public async findManyByVersionID(versionID: string) {
    return this.orm.findManyByVersionID(versionID);
  }

  public async deleteManyByVersionID(versionID: string) {
    return this.orm.deleteManyByVersionID(versionID);
  }

  async broadcastAddMany(
    authMeta: AuthMetaPayload,
    diagrams: DiagramEntity[],
    meta: { environmentID: string; assistantID: string; workspaceID: string; clientID: string; userID: number }
  ) {
    await Promise.all([
      ...diagrams.map((diagram) =>
        this.logux.processAs(
          Realtime.diagram.crud.add({
            key: diagram.id,
            value: this.entitySerializer.nullable(diagram) as Realtime.Diagram,
            projectID: meta.assistantID,
            versionID: meta.environmentID,
            workspaceID: meta.workspaceID,
          }),
          authMeta
        )
      ),
      this.reloadSharedNodes(
        diagrams.map((item) => item.toJSON()),
        meta
      ),
    ]);
  }

  public async createManyComponents(
    data: DiagramCreateData[],
    meta: { environmentID: string; assistantID: string; workspaceID: string; clientID: string; userID: number }
  ) {
    return await this.orm.createMany(
      data.map((item) => {
        const diagramID = new ObjectId().toHexString();
        return {
          ...Realtime.Utils.diagram.componentDiagramFactory(item.diagram?.name ?? ''),
          ...item.diagram,
          _id: diagramID,
          versionID: meta.environmentID,
          creatorID: meta.userID,
          diagramID,
        };
      })
    );
  }
}
