import { parseId } from '@logux/core';
import { BaseModels, BaseNode } from '@voiceflow/base-types';
import { AnyRecord, Nullish } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import type {
  PatchBuiltInLink,
  PatchByKeyLink,
  PatchDynamicLink,
  RemoveBuiltInLink,
  RemoveByKeyLink,
  RemoveDynamicLink,
} from '@/clients/voiceflow/diagram';

import { HEARTBEAT_EXPIRE_TIMEOUT } from '../constants';
import { AbstractControl } from '../control';
import AccessCache from './utils/accessCache';

type IntentStepsMap = Record<string, Realtime.diagram.DiagramIntentStepMap>;
type StartingBlockMap = Record<string, Realtime.diagram.DiagramStartingBlockMap>;

interface Resources {
  intentSteps: IntentStepsMap;
  startingBlocks: StartingBlockMap;
}
class DiagramService extends AbstractControl {
  private static getConnectedNodesKey({ diagramID }: { diagramID: string }): string {
    return `diagrams:${diagramID}:nodes`;
  }

  private connectedNodesCache = this.clients.cache.createSet({
    expire: HEARTBEAT_EXPIRE_TIMEOUT,
    keyCreator: DiagramService.getConnectedNodesKey,
  });

  private intentStepsNodeMapper = (node: BaseModels.BaseDiagramNode<AnyRecord>): Realtime.diagram.DiagramIntentStep | null => {
    if (!Realtime.Utils.typeGuards.isIntentDBNode(node)) return null;

    return {
      global: !node.data.availability || node.data.availability === BaseNode.Intent.IntentAvailability.GLOBAL,
      intentID: node.data.intent || null,
    };
  };

  private startingBlockNodeMapper = (node: BaseModels.BaseDiagramNode<AnyRecord>): Realtime.diagram.DiagramStartingBlock | null => {
    if (node.type !== BaseModels.BaseNodeType.BLOCK && node.type !== Realtime.BlockType.START) return null;

    return {
      name: node.data.name,
      blockID: node.nodeID,
    };
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

  public async get(diagramID: string): Promise<BaseModels.Diagram.Model<BaseModels.BaseDiagramNode>> {
    return this.models.diagram.findById(diagramID);
  }

  public async getAll<T extends BaseModels.BaseDiagramNode>(creatorID: number, versionID: string): Promise<BaseModels.Diagram.Model<T>[]> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.version.getDiagrams(versionID);
  }

  public async create<T extends BaseModels.BaseDiagramNode>(
    creatorID: number,
    data: Omit<BaseModels.Diagram.Model<T>, '_id'>
  ): Promise<BaseModels.Diagram.Model<T>> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.diagram.create(data);
  }

  public async patch<T extends BaseModels.BaseDiagramNode>(
    creatorID: number,
    diagramID: string,
    { _id, ...data }: Partial<BaseModels.Diagram.Model<T>>
  ): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.diagram.patch(diagramID, data);
  }

  public async delete(creatorID: number, diagramID: string): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.diagram.delete(diagramID);
  }

  public async addStep({
    creatorID,
    ...addData
  }: {
    step: BaseModels.BaseDiagramNode;
    index?: Nullish<number>;
    creatorID: number;
    diagramID: string;
    parentNodeID: string;
    nodePortRemaps?: Realtime.NodePortRemap[];
  }): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.diagram.addStep(addData);
  }

  public async addManyNodes(
    creatorID: number,
    diagramID: string,
    nodes: BaseModels.BaseDiagramNode[],
    nodePortRemaps?: Realtime.NodePortRemap[]
  ): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.diagram.addManyNodes(diagramID, nodes, nodePortRemaps);
  }

  public async isolateSteps({
    creatorID,
    ...isolateData
  }: {
    stepIDs: string[];
    creatorID: number;
    diagramID: string;
    parentNode: BaseModels.BaseBlock | BaseModels.BaseActions;
    sourceParentNodeID: string;
  }): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.diagram.isolateSteps(isolateData);
  }

  public async reorderSteps({
    creatorID,
    ...reorderData
  }: {
    index: number;
    stepID: string;
    creatorID: number;
    diagramID: string;
    parentNodeID: string;
    nodePortRemaps?: Realtime.NodePortRemap[];
  }): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.diagram.reorderSteps(reorderData);
  }

  public async transplantSteps({
    creatorID,
    ...transplantData
  }: {
    index: number;
    stepIDs: string[];
    creatorID: number;
    diagramID: string;
    removeSource?: boolean;
    nodePortRemaps?: Realtime.NodePortRemap[];
    sourceParentNodeID: string;
    targetParentNodeID: string;
  }): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.diagram.transplantSteps(transplantData);
  }

  public async updateNodeCoords(creatorID: number, diagramID: string, nodes: Record<string, Realtime.Point>): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.diagram.updateNodeCoords(diagramID, nodes);
  }

  public async updateManyNodeData<D extends AnyRecord>(creatorID: number, diagramID: string, nodes: { nodeID: string; data: D }[]): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.diagram.updateManyNodeData(diagramID, nodes);
  }

  public async removeManyNodes(creatorID: number, diagramID: string, nodes: { parentNodeID: string; stepID?: Nullish<string> }[]): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.diagram.removeManyNodes(diagramID, nodes);
  }

  public async addByKeyLink(creatorID: number, diagramID: string, nodeID: string, key: string, target: string): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.diagram.addByKeyLink(diagramID, nodeID, key, target);
  }

  public async addBuiltInLink(creatorID: number, diagramID: string, nodeID: string, type: BaseModels.PortType, target: string): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.diagram.addBuiltInLink(diagramID, nodeID, type, target);
  }

  public async addDynamicLink(creatorID: number, diagramID: string, nodeID: string, portID: string, target: string): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.diagram.addDynamicLink(diagramID, nodeID, portID, target);
  }

  public async removeManyLinks(
    creatorID: number,
    diagramID: string,
    links: (RemoveBuiltInLink | RemoveDynamicLink | RemoveByKeyLink)[]
  ): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.diagram.removeManyLinks(diagramID, links);
  }

  public async patchManyLinks(
    creatorID: number,
    diagramID: string,
    patches: (PatchBuiltInLink | PatchDynamicLink | PatchByKeyLink)[]
  ): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.diagram.patchManyLinks(diagramID, patches);
  }

  public async removeByKeyPort(creatorID: number, diagramID: string, nodeID: string, key: string): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.diagram.removeByKeyPort(diagramID, nodeID, key);
  }

  public async removeManyByKeyPort(creatorID: number, diagramID: string, nodeID: string, keys: string[]): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.diagram.removeManyByKeyPort(diagramID, nodeID, keys);
  }

  public async removeBuiltInPort(creatorID: number, diagramID: string, nodeID: string, type: BaseModels.PortType): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.diagram.removeBuiltInPort(diagramID, nodeID, type);
  }

  public async removeDynamicPort(creatorID: number, diagramID: string, nodeID: string, portID: string): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.diagram.removeDynamicPort(diagramID, nodeID, portID);
  }

  public async reorderPorts(creatorID: number, diagramID: string, nodeID: string, portID: string, index: number): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.diagram.reorderPorts(diagramID, nodeID, portID, index);
  }

  public async addByKeyPort(creatorID: number, diagramID: string, nodeID: string, port: BaseModels.BasePort, key: string): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.diagram.addByKeyPort(diagramID, nodeID, port, key);
  }

  public async addBuiltInPort(
    creatorID: number,
    diagramID: string,
    nodeID: string,
    port: BaseModels.BasePort,
    type: BaseModels.PortType
  ): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.diagram.addBuiltInPort(diagramID, nodeID, port, type);
  }

  public async addDynamicPort(creatorID: number, diagramID: string, nodeID: string, port: BaseModels.BasePort): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.diagram.addDynamicPort(diagramID, nodeID, port);
  }

  public getResources(diagrams: BaseModels.Diagram.Model[]): Resources {
    const intentSteps: IntentStepsMap = {};
    const startingBlocks: StartingBlockMap = {};

    diagrams.forEach((diagram) => {
      const diagramIntentSteps: Realtime.diagram.DiagramIntentStepMap = {};
      const diagramStartingBlocks: Realtime.diagram.DiagramStartingBlockMap = {};

      intentSteps[diagram._id] = diagramIntentSteps;
      startingBlocks[diagram._id] = diagramStartingBlocks;

      Object.values(diagram.nodes).forEach((node) => {
        const intentStepsNode = this.intentStepsNodeMapper(node);
        const startingBlockNode = this.startingBlockNodeMapper(node);

        if (intentStepsNode) diagramIntentSteps[node.nodeID] = intentStepsNode;
        if (startingBlockNode) diagramStartingBlocks[node.nodeID] = startingBlockNode;
      });
    });

    return { startingBlocks, intentSteps };
  }
}

export default DiagramService;
