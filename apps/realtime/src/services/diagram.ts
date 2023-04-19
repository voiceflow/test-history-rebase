import { parseId } from '@logux/core';
import { BaseModels, BaseNode } from '@voiceflow/base-types';
import { AnyRecord, Nullish, Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { ObjectId } from 'bson';
import _mapValues from 'lodash/mapValues';
import type { Required } from 'utility-types';
import { Optional } from 'utility-types';

import { HEARTBEAT_EXPIRE_TIMEOUT } from '../constants';
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

export type DiagramPatchData = Partial<Omit<BaseModels.Diagram.Model, DiagramService['models']['diagram']['READ_ONLY_KEYS'][number]>>;

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

  public async get(diagramID: string): Promise<BaseModels.Diagram.Model> {
    return this.models.diagram.findByID(diagramID).then(this.models.diagram.adapter.fromDB);
  }

  public async getMany(diagramIDs: string[]): Promise<BaseModels.Diagram.Model[]> {
    return this.models.diagram.findManyByIDs(diagramIDs).then(this.models.diagram.adapter.mapFromDB);
  }

  public async create(data: Optional<BaseModels.Diagram.Model, '_id'>): Promise<BaseModels.Diagram.Model> {
    return this.models.diagram.insertOne(this.models.diagram.adapter.toDB(data)).then(this.models.diagram.adapter.fromDB);
  }

  public async createMany(data: Optional<BaseModels.Diagram.Model, '_id'>[]): Promise<BaseModels.Diagram.Model[]> {
    return this.models.diagram.insertMany(this.models.diagram.adapter.mapToDB(data)).then(this.models.diagram.adapter.mapFromDB);
  }

  public async patch(diagramID: string, data: DiagramPatchData): Promise<void> {
    await this.models.diagram.updateByID(diagramID, this.models.diagram.adapter.toDB(data));
  }

  public async delete(diagramID: string): Promise<void> {
    await this.models.diagram.deleteByID(diagramID);
  }

  public async deleteMany(diagramIDs: string[]): Promise<void> {
    await this.models.diagram.deleteManyByIDs(diagramIDs);
  }

  public async getAll(versionID: string): Promise<BaseModels.Diagram.Model[]>;

  public async getAll<Key extends keyof BaseModels.Diagram.Model>(versionID: string, fields: Key[]): Promise<Pick<BaseModels.Diagram.Model, Key>[]>;

  public async getAll(versionID: string, fields?: (keyof BaseModels.Diagram.Model)[]): Promise<Partial<BaseModels.Diagram.Model>[]>;

  public async getAll(versionID: string, fields?: (keyof BaseModels.Diagram.Model)[]): Promise<Partial<BaseModels.Diagram.Model>[]> {
    return this.models.diagram.findManyByVersionID(versionID, fields).then(this.models.diagram.adapter.mapFromDB);
  }

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

  public async getNamesByIDs(diagramIDs: string[]): Promise<string[]> {
    const diagrams = await this.models.diagram.findManyByIDs(diagramIDs, ['name']);

    return diagrams.map(({ name }) => name);
  }

  public async getFlatSubtopicIDsByTopicIDs(topicIDs: string[]): Promise<string[]> {
    if (!topicIDs.length) return [];

    const topicDiagrams = await this.models.diagram.findManyByIDs(topicIDs, ['menuItems']);

    const subtopicIDs = topicDiagrams
      .flatMap(({ menuItems = [] }) => menuItems)
      .filter(({ type }) => type === BaseModels.Diagram.MenuItemType.DIAGRAM)
      .map((menuItem) => menuItem.sourceID);

    return [...subtopicIDs, ...(await this.getFlatSubtopicIDsByTopicIDs(subtopicIDs))];
  }

  public async findOneByVersionID(versionID: string, filters?: DiagramFilter): Promise<BaseModels.Diagram.Model | null> {
    const version = await this.models.diagram.findOneByVersionID(versionID, filters);
    return version ? this.models.diagram.adapter.fromDB(version) : null;
  }

  public async cloneMany(
    creatorID: number,
    versionID: string,
    ids: string[]
  ): Promise<{ diagrams: BaseModels.Diagram.Model[]; diagramIDRemap: Record<string, string> }> {
    const diagrams = await this.models.diagram.findManyByIDs(ids).then(this.models.diagram.adapter.mapFromDB);

    const diagramIDRemap = Object.fromEntries(diagrams.map((diagram) => [diagram._id, new ObjectId().toHexString()]));

    const newDiagrams = diagrams.map(({ nodes, ...diagram }) => ({
      ...Utils.id.remapObjectIDs(diagram, diagramIDRemap),
      _id: diagramIDRemap[diagram._id],
      nodes: _mapValues(nodes, (node) => Utils.id.remapObjectIDs(node, diagramIDRemap)),
      creatorID,
      versionID,
    }));

    const clonedDiagrams = await this.models.diagram
      .insertMany(this.models.diagram.adapter.mapToDB(newDiagrams))
      .then(this.models.diagram.adapter.mapFromDB);

    const clonedDiagramsMap = Object.fromEntries(clonedDiagrams.map((diagram) => [diagram._id, diagram]));

    return {
      // to be sure sure that order is the same as incoming ids
      diagrams: ids.map((id) => clonedDiagramsMap[diagramIDRemap[id]]),
      diagramIDRemap,
    };
  }

  public async addStep(
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
    await this.models.diagram.addStep(diagramID, payload);
  }

  public async addManySteps(
    diagramID: string,
    payload: {
      steps: BaseModels.BaseStep[];
      index: Nullish<number>;
      removeNodes: Realtime.RemoveNode[];
      parentNodeID: string;
      nodePortRemaps: Realtime.NodePortRemap[];
    }
  ): Promise<void> {
    await this.models.diagram.addManySteps(diagramID, payload);
  }

  public async addManyNodes(diagramID: string, payload: { nodes: BaseModels.BaseDiagramNode[] }): Promise<void> {
    await this.models.diagram.addManyNodes(diagramID, payload);
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
    removeNodes: Realtime.RemoveNode[];
    parentNodeID: string;
    nodePortRemaps: Realtime.NodePortRemap[];
  }): Promise<void> {
    await this.models.diagram.reorderSteps(reorderData);
  }

  public async transplantSteps(transplantData: {
    index: number;
    stepIDs: string[];
    diagramID: string;
    removeNodes: Realtime.RemoveNode[];
    removeSource: boolean;
    nodePortRemaps: Realtime.NodePortRemap[];
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

  public async removeManyNodes(diagramID: string, payload: { nodes: Realtime.RemoveNode[] }): Promise<void> {
    await this.models.diagram.removeManyNodes(diagramID, payload);
  }

  public async addByKeyLink(diagramID: string, nodeID: string, key: string, target: string, data?: Realtime.LinkData): Promise<void> {
    await this.models.diagram.addByKeyLink(diagramID, nodeID, key, target, data);
  }

  public async addBuiltInLink(diagramID: string, nodeID: string, type: BaseModels.PortType, target: string, data?: Realtime.LinkData): Promise<void> {
    await this.models.diagram.addBuiltInLink(diagramID, nodeID, type, target, data);
  }

  public async addDynamicLink(diagramID: string, nodeID: string, portID: string, target: string, data?: Realtime.LinkData): Promise<void> {
    await this.models.diagram.addDynamicLink(diagramID, nodeID, portID, target, data);
  }

  public async removeManyLinks(diagramID: string, links: Realtime.LinkDelete[]): Promise<void> {
    await this.models.diagram.removeManyLinks(diagramID, links);
  }

  public async patchManyLinks(diagramID: string, patches: Realtime.LinkPatch[]): Promise<void> {
    await this.models.diagram.patchManyLinks(diagramID, patches);
  }

  public async removeManyPorts(
    diagramID: string,
    payload: { ports: Realtime.PortDelete[]; nodeID: string; removeNodes: Realtime.RemoveNode[] }
  ): Promise<void> {
    await this.models.diagram.removeManyPorts(diagramID, payload);
  }

  public async removeBuiltInPort(
    diagramID: string,
    payload: { type: BaseModels.PortType; nodeID: string; removeNodes: Realtime.RemoveNode[] }
  ): Promise<void> {
    await this.models.diagram.removeBuiltInPort(diagramID, payload);
  }

  public async removeDynamicPort(diagramID: string, payload: { nodeID: string; portID: string; removeNodes: Realtime.RemoveNode[] }): Promise<void> {
    await this.models.diagram.removeDynamicPort(diagramID, payload);
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

  public async addMenuItem(diagramID: string, value: BaseModels.Diagram.MenuItem, index?: number) {
    await this.models.diagram.addMenuItem(diagramID, value, index);
  }

  public async removeMenuItem(diagramID: string, sourceID: string) {
    await this.models.diagram.removeMenuItem(diagramID, sourceID);
  }

  public async reorderMenuItems(diagramID: string, payload: { index: number; sourceID: string }): Promise<void> {
    await this.models.diagram.reorderMenuItems(diagramID, payload);
  }

  /**
   * @deprecated should be removed with Subprotocol 1.3.0
   */
  public async reorderMenuNodeIDs(diagramID: string, payload: { index: number; nodeID: string }): Promise<void> {
    await this.models.diagram.reorderMenuNodeIDs(diagramID, payload);
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

  public async syncCustomBlockPorts(diagramID: string, updatePatch: Record<string, { label: string; portID: string }[]>) {
    await this.models.diagram.syncCustomBlockPorts(diagramID, updatePatch);
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

  public async duplicateSubtopic({
    rename,
    creatorID,
    versionID,
    subtopicID,
    subtopicNames,
  }: {
    rename?: boolean;
    creatorID: number;
    versionID: string;
    subtopicID: string;
    subtopicNames?: string[];
  }) {
    const subtopicDBDiagram = await this.get(subtopicID);

    let { name } = subtopicDBDiagram;

    if (rename && subtopicNames?.length) {
      name = Realtime.Utils.diagram.getUniqueCopyName(subtopicDBDiagram.name, subtopicNames);
    }

    return this.createTopic({
      creatorID,
      versionID,
      primitiveDiagram: { ...Utils.object.omit(subtopicDBDiagram, ['_id', 'creatorID', 'versionID']), name },
    });
  }
}

export default DiagramService;
