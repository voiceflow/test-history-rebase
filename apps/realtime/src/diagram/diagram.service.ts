import { Inject, Injectable } from '@nestjs/common';
import { BaseNode } from '@voiceflow/base-types';
import { DiagramNode } from '@voiceflow/dtos';
import { NotFoundException } from '@voiceflow/exception';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import { DiagramJSON, DiagramObject, DiagramORM } from '@voiceflow/orm-designer';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { ObjectId } from 'bson';

import { MutableService } from '@/common';
import { CMSContext } from '@/types';

@Injectable()
export class DiagramService extends MutableService<DiagramORM> {
  toJSON = this.orm.jsonAdapter.fromDB;

  fromJSON = this.orm.jsonAdapter.toDB;

  mapToJSON = this.orm.jsonAdapter.mapFromDB;

  mapFromJSON = this.orm.jsonAdapter.mapToDB;

  constructor(
    @Inject(DiagramORM)
    protected readonly orm: DiagramORM,
    @Inject(LoguxService)
    private readonly logux: LoguxService
  ) {
    super();
  }

  private sharedNodeMapper(node: DiagramNode): Realtime.diagram.sharedNodes.SharedNode | null {
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

  getAllSharedNodes(diagrams: DiagramJSON[]): Realtime.diagram.sharedNodes.DiagramSharedNodeMap {
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
    diagrams: DiagramJSON[],
    meta: { auth: AuthMetaPayload; context: { environmentID: string; assistantID: string; workspaceID: string } }
  ): Promise<void> {
    const sharedNodes = this.getAllSharedNodes(diagrams);

    await this.logux.processAs(
      Realtime.diagram.sharedNodes.reload({
        versionID: meta.context.environmentID,
        projectID: meta.context.assistantID,
        workspaceID: meta.context.workspaceID,
        sharedNodes,
      }),
      meta.auth
    );
  }

  public findManyByVersionID(versionID: string) {
    return this.orm.findManyByVersionID(versionID);
  }

  public findOneByVersionAndDiagramID(versionID: string, diagramID: string) {
    return this.orm.findOneByVersionIDAndDiagramID(versionID, diagramID);
  }

  public async findOneByVersionAndDiagramIDOrFail(versionID: string, diagramID: string) {
    const diagram = await this.orm.findOneByVersionIDAndDiagramID(versionID, diagramID);

    if (!diagram) {
      throw new NotFoundException('diagram not found');
    }

    return diagram;
  }

  public findManyByVersionIDAndDiagramIDs(versionID: string, diagramIDs: string[]) {
    return this.orm.findManyByVersionIDAndDiagramIDs(versionID, diagramIDs);
  }

  public deleteManyByVersionID(versionID: string) {
    return this.orm.deleteManyByVersionID(versionID);
  }

  async broadcastAddMany(
    diagrams: DiagramObject[],
    meta: { auth: AuthMetaPayload; context: { environmentID: string; assistantID: string; workspaceID: string } }
  ) {
    const diagramsJSON = this.mapToJSON(diagrams);

    await Promise.all([
      this.logux.processAs(
        Realtime.diagram.crud.addMany({
          values: Realtime.Adapters.diagramAdapter.mapFromDB(diagramsJSON),
          projectID: meta.context.assistantID,
          versionID: meta.context.environmentID,
          workspaceID: meta.context.workspaceID,
        }),
        meta.auth
      ),
      this.reloadSharedNodes(diagramsJSON, meta),
    ]);
  }

  async broadcastDeleteMany(
    diagrams: DiagramObject[],
    meta: { auth: AuthMetaPayload; context: { environmentID: string; assistantID: string; workspaceID: string } }
  ) {
    await this.logux.processAs(
      Realtime.diagram.crud.removeMany({
        keys: diagrams.map((diagram) => diagram._id.toJSON()),
        projectID: meta.context.assistantID,
        versionID: meta.context.environmentID,
        workspaceID: meta.context.workspaceID,
      }),
      meta.auth
    );
  }

  public async createManyComponents(
    data: Partial<Omit<DiagramJSON, '_id' | 'creatorID' | 'versionID' | 'intentStepIDs' | 'menuNodeIDs' | 'children' | 'diagramID'>>[],
    { userID, context }: { userID: number; context: CMSContext }
  ) {
    return this.orm.createMany(
      data.map((item) => {
        const diagramID = new ObjectId().toJSON();

        return this.fromJSON({
          ...Realtime.Utils.diagram.componentDiagramFactory(item.name ?? ''),
          ...item,
          _id: diagramID,
          diagramID,
          versionID: context.environmentID,
          creatorID: userID,
        });
      })
    );
  }

  public async createManyTopics(
    data: Partial<Omit<DiagramJSON, '_id' | 'creatorID' | 'versionID' | 'intentStepIDs' | 'menuNodeIDs' | 'children' | 'diagramID'>>[],
    { userID, context }: { userID: number; context: CMSContext }
  ) {
    return this.orm.createMany(
      data.map((item) => {
        const diagramID = new ObjectId().toJSON();

        return this.fromJSON({
          ...Realtime.Utils.diagram.topicDiagramFactory(item.name ?? ''),
          ...item,
          _id: diagramID,
          diagramID,
          versionID: context.environmentID,
          creatorID: userID,
        });
      })
    );
  }

  public async deleteManyByVersionIDAndDiagramIDs(versionID: string, diagramIDs: string[]) {
    return this.orm.deleteManyByVersionIDAndDiagramIDs(versionID, diagramIDs);
  }
}
