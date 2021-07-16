import { AbstractControl } from '../control';
import { DEFAULT_EXPIRE_MODE, DEFAULT_EXPIRE_TIME } from './constants';

class ProjectService extends AbstractControl {
  private static getCanReadKey(projectID: string, creatorID: number): string {
    return `projects:${projectID}:can-read:${creatorID}`;
  }

  private static getConnectedDiagramsKey(projectID: string): string {
    return `projects:${projectID}:diagrams`;
  }

  private async getCachedCanRead(projectID: string, creatorID: number): Promise<boolean | null> {
    const cachedCanRead = await this.clients.redis.get(ProjectService.getCanReadKey(projectID, creatorID));

    return cachedCanRead === null ? null : Boolean(Number(cachedCanRead));
  }

  private async cacheCanRead(projectID: string, creatorID: number, canRead: boolean): Promise<void> {
    await this.clients.redis.set(ProjectService.getCanReadKey(projectID, creatorID), Number(canRead), DEFAULT_EXPIRE_MODE, DEFAULT_EXPIRE_TIME);
  }

  public async canRead(projectID: string, creatorID: number): Promise<boolean> {
    const cachedCanRead = await this.getCachedCanRead(projectID, creatorID);

    if (cachedCanRead !== null) {
      return cachedCanRead;
    }

    const canRead = await this.clients.api.project.canRead(creatorID, projectID);

    await this.cacheCanRead(projectID, creatorID, canRead);

    return canRead;
  }

  public async connectDiagram(projectID: string, diagramID: string): Promise<void> {
    await this.clients.redis.sadd(ProjectService.getConnectedDiagramsKey(projectID), diagramID);
  }

  public async disconnectDiagram(projectID: string, diagramID: string): Promise<void> {
    await this.clients.redis.srem(ProjectService.getConnectedDiagramsKey(projectID), diagramID);
  }

  public async getConnectedDiagrams(projectID: string): Promise<string[]> {
    return this.clients.redis.smembers(ProjectService.getConnectedDiagramsKey(projectID));
  }
}

export default ProjectService;
