import { Injectable } from '@nestjs/common';
import { BaseModels, BaseNode } from '@voiceflow/base-types';
import { AnyRecord, Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { ObjectId } from 'bson';
import _mapValues from 'lodash/mapValues';

import { PrimitiveDiagram } from './diagram.interface';
import { DiagramORM } from './diagram.orm';

@Injectable()
export class DiagramService {
  constructor(private orm: DiagramORM) {}

  public async get(diagramID: string): Promise<BaseModels.Diagram.Model> {
    return this.orm.findByID(diagramID);
  }

  public async patch(diagramID: string, data: BaseModels.Diagram.Model): Promise<void> {
    await this.orm.updateByID(diagramID, data);
  }

  public async cloneMany(
    creatorID: number,
    versionID: string,
    ids: string[]
  ): Promise<{ diagrams: BaseModels.Diagram.Model[]; diagramIDRemap: Record<string, string> }> {
    const diagrams = await this.orm.findManyByIDs(ids);

    const diagramIDRemap = Object.fromEntries(diagrams.map((diagram) => [diagram._id, new ObjectId().toHexString()]));

    const newDiagrams = diagrams.map(({ nodes, ...diagram }) => ({
      ...Utils.id.remapObjectIDs(diagram, diagramIDRemap),
      _id: diagramIDRemap[diagram._id],
      diagramID: diagramIDRemap[diagram.diagramID ?? diagram._id],
      nodes: _mapValues(nodes, (node) => Utils.id.remapObjectIDs(node, diagramIDRemap)),
      creatorID,
      versionID,
    }));

    const clonedDiagrams = await this.orm.insertMany(newDiagrams);

    const clonedDiagramsMap = Object.fromEntries(clonedDiagrams.map((diagram) => [diagram._id, diagram]));

    return {
      // to be sure sure that order is the same as incoming ids
      diagrams: ids.map((id) => clonedDiagramsMap[diagramIDRemap[id]]),
      diagramIDRemap,
    };
  }

  public async create(data: PrimitiveDiagram): Promise<BaseModels.Diagram.Model> {
    return this.orm.create(data);
  }

  public async getAll(versionID: string) {
    return this.orm.findManyByVersionID(versionID);
  }

  public getSharedNodes(diagrams: BaseModels.Diagram.Model[]): Realtime.diagram.sharedNodes.DiagramSharedNodeMap {
    const sharedNodes: Realtime.diagram.sharedNodes.DiagramSharedNodeMap = {};

    diagrams.forEach((diagram) => {
      const diagramSharedNode: Realtime.diagram.sharedNodes.SharedNodeMap = {};

      sharedNodes[diagram._id] = diagramSharedNode;

      Object.values(diagram.nodes).forEach((node) => {
        const sharedNode = this.sharedNodeMapper(node);

        if (!sharedNode) return;

        diagramSharedNode[sharedNode.nodeID] = sharedNode;
      });
    });

    return sharedNodes;
  }

  public async createMany(diagrams: BaseModels.Diagram.Model<BaseModels.BaseDiagramNode<AnyRecord>>[]) {
    return this.orm.insertMany(diagrams);
  }

  public async findManyByVersionID(versionID: string): Promise<string[]> {
    return this.findManyByVersionID(versionID);
  }

  private sharedNodeMapper = (node: BaseModels.BaseDiagramNode<AnyRecord>): Realtime.diagram.sharedNodes.SharedNode | null => {
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
  };
}
