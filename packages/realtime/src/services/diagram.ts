import { AnyRecord, BaseModels } from '@voiceflow/base-types';
import { Nullish } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractControl } from '../control';

class DiagramService extends AbstractControl {
  private static getCanReadKey({ diagramID, creatorID }: { diagramID: string; creatorID: number }): string {
    return `diagrams:${diagramID}:can-read:${creatorID}`;
  }

  private static getConnectedNodesKey({ diagramID }: { diagramID: string }): string {
    return `diagrams:${diagramID}:nodes`;
  }

  private canReadCache = this.clients.cache.createKeyValue({
    adapter: this.clients.cache.adapters.booleanAdapter,
    keyCreator: DiagramService.getCanReadKey,
  });

  private connectedNodesCache = this.clients.cache.createSet({ keyCreator: DiagramService.getConnectedNodesKey });

  public async canRead(creatorID: number, diagramID: string): Promise<boolean> {
    const cachedCanRead = await this.canReadCache.get({ diagramID, creatorID });

    if (cachedCanRead !== null) {
      return cachedCanRead;
    }

    const client = await this.services.voiceflow.getClientByUserID(creatorID);
    const canRead = await client.diagram.canRead(creatorID, diagramID);

    await this.canReadCache.set({ diagramID, creatorID }, canRead);

    return canRead;
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

  public async get<T extends BaseModels.BaseDiagramNode>(creatorID: number, diagramID: string): Promise<BaseModels.Diagram.Model<T>> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.diagram.get(diagramID);
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

  public async addStep(
    creatorID: number,
    diagramID: string,
    blockID: string,
    step: BaseModels.BaseDiagramNode,
    index?: Nullish<number>
  ): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.diagram.addStep(diagramID, blockID, step, index);
  }

  public async addManyNodes(creatorID: number, diagramID: string, nodes: BaseModels.BaseDiagramNode[]): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.diagram.addManyNodes(diagramID, nodes);
  }

  public async isolateStep(
    creatorID: number,
    diagramID: string,
    sourceBlockID: string,
    block: BaseModels.BaseDiagramNode,
    stepID: string
  ): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.diagram.isolateStep(diagramID, sourceBlockID, block, stepID);
  }

  public async reorderSteps(creatorID: number, diagramID: string, blockID: string, stepID: string, index: number): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.diagram.reorderSteps(diagramID, blockID, stepID, index);
  }

  // eslint-disable-next-line max-params
  public async transplantSteps(
    creatorID: number,
    diagramID: string,
    sourceBlockID: string,
    targetBlockID: string,
    stepIDs: string[],
    index: number
  ): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.diagram.transplantSteps(diagramID, sourceBlockID, targetBlockID, stepIDs, index);
  }

  public async updateBlockCoords(creatorID: number, diagramID: string, blocks: Record<string, Realtime.Point>): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.diagram.updateBlockCoords(diagramID, blocks);
  }

  public async removeManyNodes(creatorID: number, diagramID: string, nodes: { blockID: string; stepID?: Nullish<string> }[]): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.diagram.removeManyNodes(diagramID, nodes);
  }

  public async addLink(creatorID: number, diagramID: string, nodeID: string, portID: string, target: string): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.diagram.addLink(diagramID, nodeID, portID, target);
  }

  public async removeManyLinks(creatorID: number, diagramID: string, links: { nodeID: string; portID: string }[]): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.diagram.removeManyLinks(diagramID, links);
  }

  public async patchManyLinks<D extends AnyRecord>(
    creatorID: number,
    diagramID: string,
    patches: { nodeID: string; portID: string; data: D }[]
  ): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.diagram.patchManyLinks(diagramID, patches);
  }

  public async removePort(creatorID: number, diagramID: string, nodeID: string, portID: string): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.diagram.removePort(diagramID, nodeID, portID);
  }

  public async reorderPorts(creatorID: number, diagramID: string, nodeID: string, portID: string, index: number): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.diagram.reorderPorts(diagramID, nodeID, portID, index);
  }

  public async addPort(creatorID: number, diagramID: string, nodeID: string, port: BaseModels.BasePort, index?: number): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.diagram.addPort(diagramID, nodeID, port, index);
  }
}

export default DiagramService;
