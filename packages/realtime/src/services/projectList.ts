import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractControl } from '../control';

class ProjectListService extends AbstractControl {
  private static getCanReadKey({ projectListID, creatorID }: { projectListID: string; creatorID: number }): string {
    return `projectList:${projectListID}:can-read:${creatorID}`;
  }

  private canReadCache = this.clients.cache.createKeyValue({
    adapter: this.clients.cache.adapters.booleanAdapter,
    keyCreator: ProjectListService.getCanReadKey,
  });

  public async canRead(projectListID: string, creatorID: number): Promise<boolean> {
    const cachedCanRead = await this.canReadCache.get({ projectListID, creatorID });

    if (cachedCanRead !== null) {
      return cachedCanRead;
    }

    const client = await this.services.voiceflow.getClientByUserID(creatorID);
    const canRead = await client.workspace.canRead(creatorID, projectListID);

    await this.canReadCache.set({ projectListID, creatorID }, canRead);

    return canRead;
  }

  public async getAll(workspaceID: string, creatorID: number): Promise<Realtime.DBProjectList[]> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.projectList.getAll(workspaceID);
  }
}

export default ProjectListService;
