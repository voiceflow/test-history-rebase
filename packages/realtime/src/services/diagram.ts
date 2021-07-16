import { AbstractControl } from '../control';
import { DEFAULT_EXPIRE_MODE, DEFAULT_EXPIRE_TIME } from './constants';

class DiagramService extends AbstractControl {
  private static getCanReadKey(diagramID: string, creatorID: number): string {
    return `diagrams:${diagramID}:can-read:${creatorID}`;
  }

  private static getConnectedNodesKey(diagramID: string): string {
    return `diagrams:${diagramID}:nodes`;
  }

  private async getCachedCanRead(diagramID: string, creatorID: number): Promise<boolean | null> {
    const cachedCanRead = await this.clients.redis.get(DiagramService.getCanReadKey(diagramID, creatorID));

    return cachedCanRead === null ? null : Boolean(Number(cachedCanRead));
  }

  private async cacheCanRead(diagramID: string, creatorID: number, canRead: boolean): Promise<void> {
    await this.clients.redis.set(DiagramService.getCanReadKey(diagramID, creatorID), Number(canRead), DEFAULT_EXPIRE_MODE, DEFAULT_EXPIRE_TIME);
  }

  public async canRead(diagramID: string, creatorID: number): Promise<boolean> {
    const cachedCanRead = await this.getCachedCanRead(diagramID, creatorID);

    if (cachedCanRead !== null) {
      return cachedCanRead;
    }

    const canRead = await this.clients.api.diagram.canRead(creatorID, diagramID);

    await this.cacheCanRead(diagramID, creatorID, canRead);

    return canRead;
  }

  public async connectNode(diagramID: string, nodeID: string): Promise<void> {
    await this.clients.redis.sadd(DiagramService.getConnectedNodesKey(diagramID), nodeID);
  }

  public async disconnectNode(diagramID: string, nodeID: string): Promise<void> {
    await this.clients.redis.srem(DiagramService.getConnectedNodesKey(diagramID), nodeID);
  }

  public async getConnectedNodes(diagramID: string): Promise<string[]> {
    return this.clients.redis.smembers(DiagramService.getConnectedNodesKey(diagramID));
  }

  public async getConnectedNodesSize(diagramID: string): Promise<number> {
    return this.clients.redis.scard(DiagramService.getConnectedNodesKey(diagramID));
  }
}

export default DiagramService;
