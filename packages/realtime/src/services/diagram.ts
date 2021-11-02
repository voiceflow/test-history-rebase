import { Models as BaseModels } from '@voiceflow/base-types';

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

  public async get<T extends BaseModels.BaseDiagramNode>(creatorID: number, diagramID: string): Promise<BaseModels.Diagram<T>> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.diagram.get(diagramID);
  }

  public async getAll<T extends BaseModels.BaseDiagramNode>(creatorID: number, versionID: string): Promise<BaseModels.Diagram<T>[]> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.version.getDiagrams(versionID);
  }

  public async create<T extends BaseModels.BaseDiagramNode>(
    creatorID: number,
    data: Omit<BaseModels.Diagram<T>, '_id'>
  ): Promise<BaseModels.Diagram<T>> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.diagram.create(data);
  }

  public async patch<T extends BaseModels.BaseDiagramNode>(
    creatorID: number,
    diagramID: string,
    { _id, ...data }: Partial<BaseModels.Diagram<T>>
  ): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.diagram.patch(diagramID, data);
  }

  public async delete(creatorID: number, diagramID: string): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.diagram.delete(diagramID);
  }
}

export default DiagramService;
