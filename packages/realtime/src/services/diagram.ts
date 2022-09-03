import { parseId } from '@logux/core';
import { BaseModels, BaseNode } from '@voiceflow/base-types';
import { AnyRecord, Nullish, Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { ObjectId } from 'bson';
import _mapValues from 'lodash/mapValues';
import { Optional } from 'utility-types';

import { HEARTBEAT_EXPIRE_TIMEOUT } from '../constants';
import { AbstractControl } from '../control';
import AccessCache from './utils/accessCache';

// utility function to format node update data
const nodeDataUpdates = <D extends AnyRecord>(nodeID: string, data: D) => {
  const entries = Object.entries(data);
  return entries.reduce<{ sets: { path: string; value: any }[]; unsets: { path: string }[]; nodeID: string }>(
    (acc, [path, value]) => {
      if (value == null) {
        acc.unsets.push({ path });
      } else {
        acc.sets.push({ path, value });
      }

      return acc;
    },
    { sets: [], unsets: [], nodeID }
  );
};

class DiagramService extends AbstractControl {
  private static getConnectedNodesKey({ diagramID }: { diagramID: string }): string {
    return `diagrams:${diagramID}:nodes`;
  }

  private connectedNodesCache = this.clients.cache.createSet({
    expire: HEARTBEAT_EXPIRE_TIMEOUT,
    keyCreator: DiagramService.getConnectedNodesKey,
  });

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

    if (Realtime.Utils.typeGuards.isComponentDBNode(node)) {
      return { type: Realtime.BlockType.COMPONENT, nodeID: node.nodeID, componentID: node.data.diagramID };
    }

    return null;
  };

  public access = new AccessCache('diagram', this.clients, this.services);

  public async connectNode(diagramID: string, nodeID: string): Promise<void> {
    await this.connectedNodesCache.add({ diagramID }, nodeID);
  }

  public async disconnectNode(diagramID: string, nodeID: string): Promise<void> {
    await this.connectedNodesCache.remove({ diagramID }, nodeID);
  }

  public async getConnectedNodes(diagramID: string): Promise<string[]> {
    return this.connectedNodesCache.values({ diagramID });
  }

  public async getConnectedNodesSize(diagramID: string): Promise<number> {
    return this.connectedNodesCache.size({ diagramID });
  }

  public async getConnectedViewers(diagramID: string): Promise<Realtime.Viewer[]> {
    const nodeIDs = await this.getConnectedNodes(diagramID);
    const userIDs = [...new Set(nodeIDs.map((userNodeID) => parseId(userNodeID).userId!))];

    return this.services.viewer.getViewers(userIDs);
  }

  public async get(diagramID: string): Promise<BaseModels.Diagram.Model> {
    return this.models.diagram.findById(diagramID).then(this.models.diagram.fromDB);
  }

  getAll(versionID: string): Promise<BaseModels.Diagram.Model[]>;

  getAll<Field extends keyof BaseModels.Diagram.Model>(versionID: string, fields: Field[]): Promise<Pick<BaseModels.Diagram.Model, Field>[]>;

  public async getAll(versionID: string, fields?: Array<keyof BaseModels.Diagram.Model>): Promise<BaseModels.Diagram.Model[]> {
    if (fields) return this.models.diagram.findManyByVersion(versionID, [], fields).then(this.models.diagram.mapFromDB);

    return this.models.diagram.findManyByVersion(versionID).then(this.models.diagram.mapFromDB);
  }

  getByIDs(versionID: string, ids: string[]): Promise<BaseModels.Diagram.Model[]>;

  getByIDs<Field extends keyof BaseModels.Diagram.Model>(
    versionID: string,
    ids: string[],
    fields: Field[]
  ): Promise<Pick<BaseModels.Diagram.Model, Field>[]>;

  public async getByIDs(versionID: string, ids: string[], fields?: Array<keyof BaseModels.Diagram.Model>): Promise<BaseModels.Diagram.Model[]> {
    if (fields) return this.models.diagram.findManyByVersion(versionID, ids, fields).then(this.models.diagram.mapFromDB);

    return this.models.diagram.findManyByVersion(versionID, ids).then(this.models.diagram.mapFromDB);
  }

  public async getAllNames(versionID: string): Promise<string[]> {
    const diagrams = await this.getAll(versionID, ['name']);

    return diagrams.map(({ name }) => name);
  }

  public async create(data: Omit<BaseModels.Diagram.Model, '_id'>): Promise<BaseModels.Diagram.Model> {
    return this.models.diagram.create(this.models.diagram.toDB(data)).then(this.models.diagram.fromDB);
  }

  public async createMany(data: Optional<BaseModels.Diagram.Model, '_id'>[]): Promise<BaseModels.Diagram.Model[]> {
    return this.models.diagram.createMany(this.models.diagram.mapToDB(data)).then(this.models.diagram.mapFromDB);
  }

  public async cloneMany(creatorID: number, versionID: string, ids: string[]): Promise<BaseModels.Diagram.Model[]> {
    const oldDiagrams = await this.getByIDs(versionID, ids);

    const diagramIDMap = new Map(oldDiagrams.map((diagram) => [diagram._id, new ObjectId().toHexString()]));

    const clonedDBDiagrams = oldDiagrams.map(({ nodes, ...diagram }) => ({
      ...Utils.id.remapObjectIDs(diagram, diagramIDMap),
      _id: new ObjectId(diagramIDMap.get(diagram._id)),
      nodes: _mapValues(nodes, (node) => Utils.id.remapObjectIDs(node, diagramIDMap)),
      creatorID,
      versionID: new ObjectId(versionID),
    }));

    const clonedDiagrams = await this.models.diagram.insertMany(clonedDBDiagrams).then(this.models.diagram.mapFromDB);
    const clonedDiagramsMap = new Map(clonedDiagrams.map((diagram) => [diagram._id, diagram]));

    // to be sure sure that order is the same as incoming ids
    return ids.map((id) => clonedDiagramsMap.get(diagramIDMap.get(id)!)!);
  }

  public async patch(diagramID: string, { _id, ...data }: Partial<BaseModels.Diagram.Model>): Promise<void> {
    await this.models.diagram.updateById(diagramID, this.models.diagram.toDB(data));
  }

  public async delete(diagramID: string): Promise<void> {
    await this.models.diagram.deleteById(diagramID);
  }

  public async deleteMany(diagramIDs: string[]): Promise<void> {
    await this.models.diagram.deleteManyByIDs(diagramIDs);
  }

  public async addStep(addData: {
    step: BaseModels.BaseStep;
    index?: Nullish<number>;
    isActions?: boolean;
    diagramID: string;
    parentNodeID: string;
    nodePortRemaps?: Realtime.NodePortRemap[];
  }): Promise<void> {
    await this.models.diagram.addStep(addData);
  }

  public async addManyNodes(diagramID: string, nodes: BaseModels.BaseDiagramNode[], nodePortRemaps?: Realtime.NodePortRemap[]): Promise<void> {
    await this.models.diagram.addManyNodes(diagramID, nodes, nodePortRemaps);
  }

  public async isolateSteps(isolateData: {
    stepIDs: string[];
    diagramID: string;
    parentNode: BaseModels.BaseBlock | BaseModels.BaseActions;
    sourceParentNodeID: string;
  }): Promise<void> {
    await this.models.diagram.isolateSteps(isolateData);
  }

  public async reorderSteps(reorderData: {
    index: number;
    stepID: string;
    diagramID: string;
    parentNodeID: string;
    nodePortRemaps?: Realtime.NodePortRemap[];
  }): Promise<void> {
    await this.models.diagram.reorderSteps(reorderData);
  }

  public async transplantSteps(transplantData: {
    index: number;
    stepIDs: string[];
    diagramID: string;
    removeSource?: boolean;
    nodePortRemaps?: Realtime.NodePortRemap[];
    sourceParentNodeID: string;
    targetParentNodeID: string;
  }): Promise<void> {
    await this.models.diagram.transplantSteps(transplantData);
  }

  public async updateNodeCoords(diagramID: string, nodes: Record<string, Realtime.Point>): Promise<void> {
    await this.models.diagram.updateNodeCoords(diagramID, nodes);
  }

  public async updateManyNodeData<D extends AnyRecord>(diagramID: string, nodes: { nodeID: string; data: D }[]): Promise<void> {
    await this.models.diagram.updateManyNodeData(
      diagramID,
      nodes.map(({ nodeID, data }) => nodeDataUpdates(nodeID, data))
    );
  }

  public async removeManyNodes(diagramID: string, nodes: { parentNodeID: string; stepID?: Nullish<string> }[]): Promise<void> {
    await this.models.diagram.removeManyNodes(diagramID, nodes);
  }

  public async addByKeyLink(diagramID: string, nodeID: string, key: string, target: string): Promise<void> {
    await this.models.diagram.addByKeyLink(diagramID, nodeID, key, target);
  }

  public async addBuiltInLink(diagramID: string, nodeID: string, type: BaseModels.PortType, target: string): Promise<void> {
    await this.models.diagram.addBuiltInLink(diagramID, nodeID, type, target);
  }

  public async addDynamicLink(diagramID: string, nodeID: string, portID: string, target: string): Promise<void> {
    await this.models.diagram.addDynamicLink(diagramID, nodeID, portID, target);
  }

  public async removeManyLinks(diagramID: string, links: Realtime.LinkDelete[]): Promise<void> {
    await this.models.diagram.removeManyLinks(diagramID, links);
  }

  public async patchManyLinks(diagramID: string, patches: Realtime.LinkPatch[]): Promise<void> {
    await this.models.diagram.patchManyLinks(diagramID, patches);
  }

  public async removeManyPorts(diagramID: string, nodeID: string, ports: Realtime.PortDelete[]): Promise<void> {
    await this.models.diagram.removeManyPorts(diagramID, nodeID, ports);
  }

  public async removeBuiltInPort(diagramID: string, nodeID: string, type: BaseModels.PortType): Promise<void> {
    await this.models.diagram.removeBuiltInPort(diagramID, nodeID, type);
  }

  public async removeDynamicPort(diagramID: string, nodeID: string, portID: string): Promise<void> {
    await this.models.diagram.removeDynamicPort(diagramID, nodeID, portID);
  }

  public async reorderPorts(diagramID: string, nodeID: string, portID: string, index: number): Promise<void> {
    await this.models.diagram.reorderPorts(diagramID, nodeID, portID, index);
  }

  public async addByKeyPort(diagramID: string, nodeID: string, key: string, port: BaseModels.BasePort): Promise<void> {
    await this.models.diagram.addByKeyPort(diagramID, nodeID, key, port);
  }

  public async addBuiltInPort(diagramID: string, nodeID: string, type: BaseModels.PortType, port: BaseModels.BasePort): Promise<void> {
    await this.models.diagram.addBuiltInPort(diagramID, nodeID, type, port);
  }

  public async addDynamicPort(diagramID: string, nodeID: string, port: BaseModels.BasePort): Promise<void> {
    await this.models.diagram.addDynamicPort(diagramID, nodeID, port);
  }

  public async reorderMenuNodes(reorderData: { index: number; nodeID: string; diagramID: string }): Promise<void> {
    await this.models.diagram.reorderMenuNodes(reorderData);
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
}

export default DiagramService;
