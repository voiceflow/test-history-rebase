import { parseId } from '@logux/core';
import { BaseModels, BaseNode } from '@voiceflow/base-types';
import { AnyRecord, Nullish, Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { ObjectId } from 'bson';
import _mapValues from 'lodash/mapValues.js';
import type { Required } from 'utility-types';
import { Optional } from 'utility-types';

import { HEARTBEAT_EXPIRE_TIMEOUT } from '@/constants';

import { AbstractControl } from '../control';
import type { DiagramFilter } from '../models/diagram';
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

type PrimitiveDiagram = Optional<BaseModels.Diagram.Model, '_id' | 'diagramID'>;

export type DiagramPatchData = Partial<
  Omit<BaseModels.Diagram.Model, DiagramService['models']['diagram']['READ_ONLY_KEYS'][number]>
>;

class DiagramService extends AbstractControl {
  private static getConnectedNodesKey({ versionID, diagramID }: { versionID: string; diagramID: string }): string {
    return `${versionID}/diagrams:${diagramID}:nodes`;
  }

  private connectedNodesCache = this.clients.cache.createSet({
    expire: HEARTBEAT_EXPIRE_TIMEOUT,
    keyCreator: DiagramService.getConnectedNodesKey,
  });

  private insertNewDiagramToDB = (data: PrimitiveDiagram): BaseModels.Diagram.Model => {
    const _id = data._id ?? new ObjectId().toHexString();

    return {
      ...data,
      _id,
      diagramID: _id,
    };
  };

  private sharedNodeMapper = (
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
      return { type: Realtime.BlockType.START, name: node.data.label || '', nodeID: node.nodeID, triggers: node.data.triggers ?? [] };
    }

    if (Realtime.Utils.typeGuards.isBlockDBNode(node)) {
      return { type: Realtime.BlockType.COMBINED, name: node.data.name, nodeID: node.nodeID };
    }

    return null;
  };

  public access = new AccessCache('diagram', this.clients, this.services);

  public async get(versionID: string, diagramID: string): Promise<BaseModels.Diagram.Model> {
    const diagram = await this.models.diagram.findByVersionIDAndDiagramID(versionID, diagramID);

    if (!diagram) {
      throw new Error(`Diagram ${diagramID} not found`);
    }

    return this.models.diagram.adapter.fromDB(diagram);
  }

  public async getMany(versionID: string, diagramIDs: string[]): Promise<BaseModels.Diagram.Model[]> {
    return this.models.diagram
      .findManyByVersionIDAndDiagramIDs(versionID, diagramIDs)
      .then(this.models.diagram.adapter.mapFromDB);
  }

  public async create(data: PrimitiveDiagram): Promise<BaseModels.Diagram.Model> {
    return this.models.diagram
      .insertOne(this.models.diagram.adapter.toDB(this.insertNewDiagramToDB(data)))
      .then(this.models.diagram.adapter.fromDB);
  }

  public async createMany(data: PrimitiveDiagram[]): Promise<BaseModels.Diagram.Model[]> {
    return this.models.diagram
      .insertMany(this.models.diagram.adapter.mapToDB(data.map(this.insertNewDiagramToDB)))
      .then(this.models.diagram.adapter.mapFromDB);
  }

  public async patch(versionID: string, diagramID: string, data: DiagramPatchData): Promise<void> {
    await this.models.diagram.updateOneByVersionIDAndDiagramID(
      versionID,
      diagramID,
      this.models.diagram.adapter.toDB(data)
    );
  }

  public async delete(versionID: string, diagramID: string): Promise<void> {
    await this.models.diagram.deleteOneByVersionIDAndDiagramID(versionID, diagramID);
  }

  public async deleteMany(versionID: string, diagramIDs: string[]): Promise<void> {
    await this.models.diagram.deleteManyByVersionIDAndDiagramIDs(versionID, diagramIDs);
  }

  public async getAll(versionID: string): Promise<BaseModels.Diagram.Model[]>;

  public async getAll<Key extends keyof BaseModels.Diagram.Model>(
    versionID: string,
    fields: Key[]
  ): Promise<Pick<BaseModels.Diagram.Model, Key>[]>;

  public async getAll(
    versionID: string,
    fields?: (keyof BaseModels.Diagram.Model)[]
  ): Promise<Partial<BaseModels.Diagram.Model>[]>;

  public async getAll(
    versionID: string,
    fields?: (keyof BaseModels.Diagram.Model)[]
  ): Promise<Partial<BaseModels.Diagram.Model>[]> {
    return this.models.diagram.findManyByVersionID(versionID, fields).then(this.models.diagram.adapter.mapFromDB);
  }

  public async connectNode(versionID: string, diagramID: string, nodeID: string): Promise<void> {
    await this.connectedNodesCache.add({ versionID, diagramID }, nodeID);
  }

  public async disconnectNode(versionID: string, diagramID: string, nodeID: string): Promise<void> {
    await this.connectedNodesCache.remove({ versionID, diagramID }, nodeID);
  }

  public async getConnectedNodes(versionID: string, diagramID: string): Promise<string[]> {
    return this.connectedNodesCache.values({ versionID, diagramID });
  }

  public async getConnectedNodesSize(versionID: string, diagramID: string): Promise<number> {
    return this.connectedNodesCache.size({ versionID, diagramID });
  }

  public async getConnectedViewers(versionID: string, diagramID: string): Promise<Realtime.Viewer[]> {
    const nodeIDs = await this.getConnectedNodes(versionID, diagramID);
    const userIDs = [
      ...new Set(nodeIDs.map((userNodeID) => parseId(userNodeID).userId).filter((id): id is string => !!id)),
    ];

    return this.services.viewer.getViewers(userIDs);
  }

  public async getNamesByIDs(versionID: string, diagramIDs: string[]): Promise<string[]> {
    const diagrams = await this.models.diagram.findManyByVersionIDAndDiagramIDs(versionID, diagramIDs, ['name']);

    return diagrams.map(({ name }) => name);
  }

  public async findOneByVersionID(
    versionID: string,
    filters?: DiagramFilter
  ): Promise<BaseModels.Diagram.Model | null> {
    const version = await this.models.diagram.findOneByVersionID(versionID, filters);
    return version ? this.models.diagram.adapter.fromDB(version) : null;
  }

  public async cloneManyWithIDsRemap({
    creatorID,
    versionID,
    ids,
    diagramIDRemap,
  }: {
    creatorID: number;
    versionID: string;
    ids: string[];
    diagramIDRemap: Record<string, string>;
  }): Promise<BaseModels.Diagram.Model[]> {
    const diagrams = await this.models.diagram
      .findManyByVersionIDAndDiagramIDs(versionID, ids)
      .then(this.models.diagram.adapter.mapFromDB);

    const newDiagrams = diagrams.map(({ nodes, ...diagram }) => ({
      ...Utils.id.remapObjectIDs(diagram, diagramIDRemap),
      _id: new ObjectId().toHexString(),
      diagramID: diagramIDRemap[diagram.diagramID],
      nodes: _mapValues(nodes, (node) => Utils.id.remapObjectIDs(node, diagramIDRemap)),
      creatorID,
      versionID,
    }));

    return this.models.diagram
      .insertMany(this.models.diagram.adapter.mapToDB(newDiagrams))
      .then(this.models.diagram.adapter.mapFromDB);
  }

  public async addStep(
    versionID: string,
    diagramID: string,
    payload: {
      step: BaseModels.BaseStep;
      index: Nullish<number>;
      isActions: boolean;
      removeNodes: Realtime.RemoveNode[];
      parentNodeID: string;
      nodePortRemaps: Realtime.NodePortRemap[];
    }
  ): Promise<void> {
    await this.models.diagram.addStep(versionID, diagramID, payload);
  }

  public async addManySteps(
    versionID: string,
    diagramID: string,
    payload: {
      steps: BaseModels.BaseStep[];
      index: Nullish<number>;
      removeNodes: Realtime.RemoveNode[];
      parentNodeID: string;
      nodePortRemaps: Realtime.NodePortRemap[];
    }
  ): Promise<void> {
    await this.models.diagram.addManySteps(versionID, diagramID, payload);
  }

  public async addManyNodes(
    versionID: string,
    diagramID: string,
    payload: { nodes: BaseModels.BaseDiagramNode[] }
  ): Promise<void> {
    await this.models.diagram.addManyNodes(versionID, diagramID, payload);
  }

  public async isolateSteps(isolateData: {
    stepIDs: string[];
    diagramID: string;
    versionID: string;
    parentNode: BaseModels.BaseBlock | BaseModels.BaseActions;
    sourceParentNodeID: string;
  }): Promise<void> {
    await this.models.diagram.isolateSteps(isolateData);
  }

  public async reorderSteps(reorderData: {
    index: number;
    stepID: string;
    diagramID: string;
    versionID: string;
    removeNodes: Realtime.RemoveNode[];
    parentNodeID: string;
    nodePortRemaps: Realtime.NodePortRemap[];
  }): Promise<void> {
    await this.models.diagram.reorderSteps(reorderData);
  }

  public async transplantSteps(transplantData: {
    index: number;
    stepIDs: string[];
    versionID: string;
    diagramID: string;
    removeNodes: Realtime.RemoveNode[];
    removeSource: boolean;
    nodePortRemaps: Realtime.NodePortRemap[];
    sourceParentNodeID: string;
    targetParentNodeID: string;
  }): Promise<void> {
    await this.models.diagram.transplantSteps(transplantData);
  }

  public async updateNodeCoords(
    versionID: string,
    diagramID: string,
    nodes: Record<string, Realtime.Point>
  ): Promise<void> {
    await this.models.diagram.updateNodeCoords(versionID, diagramID, nodes);
  }

  public async updateManyNodeData<D extends AnyRecord>(
    versionID: string,
    diagramID: string,
    nodes: { nodeID: string; data: D }[]
  ): Promise<void> {
    await this.models.diagram.updateManyNodeData(
      versionID,
      diagramID,
      nodes.map(({ nodeID, data }) => nodeDataUpdates(nodeID, data))
    );
  }

  public async removeManyNodes(
    versionID: string,
    diagramID: string,
    payload: { nodes: Realtime.RemoveNode[] }
  ): Promise<void> {
    await this.models.diagram.removeManyNodes(versionID, diagramID, payload);
  }

  public async addByKeyLink(
    versionID: string,
    diagramID: string,
    nodeID: string,
    link: { key: string; target: string; data?: Realtime.LinkData }
  ): Promise<void> {
    await this.models.diagram.addByKeyLink(versionID, diagramID, nodeID, link);
  }

  public async addBuiltInLink(
    versionID: string,
    diagramID: string,
    nodeID: string,
    link: { type: BaseModels.PortType; target: string; data?: Realtime.LinkData }
  ): Promise<void> {
    await this.models.diagram.addBuiltInLink(versionID, diagramID, nodeID, link);
  }

  public async addDynamicLink(
    versionID: string,
    diagramID: string,
    nodeID: string,
    link: { portID: string; target: string; data?: Realtime.LinkData }
  ): Promise<void> {
    await this.models.diagram.addDynamicLink(versionID, diagramID, nodeID, link);
  }

  public async removeManyLinks(versionID: string, diagramID: string, links: Realtime.LinkDelete[]): Promise<void> {
    await this.models.diagram.removeManyLinks(versionID, diagramID, links);
  }

  public async patchManyLinks(versionID: string, diagramID: string, patches: Realtime.LinkPatch[]): Promise<void> {
    await this.models.diagram.patchManyLinks(versionID, diagramID, patches);
  }

  public async removeManyPorts(
    versionID: string,
    diagramID: string,
    payload: { ports: Realtime.PortDelete[]; nodeID: string; removeNodes: Realtime.RemoveNode[] }
  ): Promise<void> {
    await this.models.diagram.removeManyPorts(versionID, diagramID, payload);
  }

  public async removeBuiltInPort(
    versionID: string,
    diagramID: string,
    payload: { type: BaseModels.PortType; nodeID: string; removeNodes: Realtime.RemoveNode[] }
  ): Promise<void> {
    await this.models.diagram.removeBuiltInPort(versionID, diagramID, payload);
  }

  public async removeDynamicPort(
    versionID: string,
    diagramID: string,
    payload: { nodeID: string; portID: string; removeNodes: Realtime.RemoveNode[] }
  ): Promise<void> {
    await this.models.diagram.removeDynamicPort(versionID, diagramID, payload);
  }

  public async reorderPorts(
    versionID: string,
    diagramID: string,
    nodeID: string,
    portID: string,
    index: number
  ): Promise<void> {
    await this.models.diagram.reorderPorts(versionID, diagramID, nodeID, portID, index);
  }

  public async addByKeyPort(
    versionID: string,
    diagramID: string,
    nodeID: string,
    key: string,
    port: BaseModels.BasePort
  ): Promise<void> {
    await this.models.diagram.addByKeyPort(versionID, diagramID, nodeID, key, port);
  }

  public async addBuiltInPort(
    versionID: string,
    diagramID: string,
    nodeID: string,
    type: BaseModels.PortType,
    port: BaseModels.BasePort
  ): Promise<void> {
    await this.models.diagram.addBuiltInPort(versionID, diagramID, nodeID, type, port);
  }

  public async addDynamicPort(
    versionID: string,
    diagramID: string,
    nodeID: string,
    port: BaseModels.BasePort
  ): Promise<void> {
    await this.models.diagram.addDynamicPort(versionID, diagramID, nodeID, port);
  }

  public async addMenuItem(versionID: string, diagramID: string, value: BaseModels.Diagram.MenuItem, index?: number) {
    await this.models.diagram.addMenuItem(versionID, diagramID, value, index);
  }

  public async removeMenuItem(versionID: string, diagramID: string, sourceID: string) {
    await this.models.diagram.removeMenuItem(versionID, diagramID, sourceID);
  }

  public async reorderMenuItems(
    versionID: string,
    diagramID: string,
    payload: { index: number; sourceID: string }
  ): Promise<void> {
    await this.models.diagram.reorderMenuItems(versionID, diagramID, payload);
  }

  public getSharedNodes(diagrams: BaseModels.Diagram.Model[]): Realtime.diagram.sharedNodes.DiagramSharedNodeMap {
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

  public async syncCustomBlockPorts(
    versionID: string,
    diagramID: string,
    updatePatch: Record<string, { label: string; portID: string }[]>
  ) {
    await this.models.diagram.syncCustomBlockPorts(versionID, diagramID, updatePatch);
  }

  public async createTopic({
    creatorID,
    versionID,
    primitiveDiagram,
  }: {
    creatorID: number;
    versionID: string;
    primitiveDiagram: Required<Partial<Realtime.Utils.diagram.PrimitiveDiagram>, 'name'>;
  }) {
    const factoryTopic = Realtime.Utils.diagram.topicDiagramFactory(primitiveDiagram.name);

    const nodes = primitiveDiagram.nodes ?? factoryTopic.nodes;

    const intentStepIDs = Object.values(nodes)
      .filter(Realtime.Utils.typeGuards.isIntentDBNode)
      .map((node) => node.nodeID);

    return this.create({
      ...factoryTopic,
      ...primitiveDiagram,
      name: primitiveDiagram.name,
      type: BaseModels.Diagram.DiagramType.TOPIC,
      nodes,
      creatorID,
      versionID,
      intentStepIDs,
    });
  }
}

export default DiagramService;
