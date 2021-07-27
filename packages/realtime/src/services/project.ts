import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractControl } from '../control';

class ProjectService extends AbstractControl {
  private static getCanReadKey({ projectID, creatorID }: { projectID: string; creatorID: number }): string {
    return `projects:${projectID}:can-read:${creatorID}`;
  }

  private static getConnectedDiagramsKey({ projectID }: { projectID: string }): string {
    return `projects:${projectID}:diagrams`;
  }

  private canReadCache = this.clients.cache.createKeyValue({
    adapter: this.clients.cache.adapters.booleanAdapter,
    keyCreator: ProjectService.getCanReadKey,
  });

  private connectedDiagramsCache = this.clients.cache.createSet({ keyCreator: ProjectService.getConnectedDiagramsKey });

  public async canRead(projectID: string, creatorID: number): Promise<boolean> {
    const cachedCanRead = await this.canReadCache.get({ projectID, creatorID });

    if (cachedCanRead !== null) {
      return cachedCanRead;
    }

    const client = await this.services.voiceflow.getClientByUserID(creatorID);
    const canRead = await client.project.canRead(creatorID, projectID);

    await this.canReadCache.set({ projectID, creatorID }, canRead);

    return canRead;
  }

  public async connectDiagram(projectID: string, diagramID: string): Promise<void> {
    await this.connectedDiagramsCache.add({ projectID }, diagramID);
  }

  public async disconnectDiagram(projectID: string, diagramID: string): Promise<void> {
    await this.connectedDiagramsCache.remove({ projectID }, diagramID);
  }

  public async getConnectedDiagrams(projectID: string): Promise<string[]> {
    return this.connectedDiagramsCache.values({ projectID });
  }

  public async getAll(workspaceID: string, creatorID: number): Promise<Realtime.DBProject[]> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.project.list(workspaceID);
  }
}

export default ProjectService;
