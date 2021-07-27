import { AbstractControl } from '../control';

class WorkspaceService extends AbstractControl {
  private static getCanReadKey({ workspaceID, creatorID }: { workspaceID: string; creatorID: number }): string {
    return `workspace:${workspaceID}:can-read:${creatorID}`;
  }

  private canReadCache = this.clients.cache.createKeyValue({
    adapter: this.clients.cache.adapters.booleanAdapter,
    keyCreator: WorkspaceService.getCanReadKey,
  });

  public async canRead(workspaceID: string, creatorID: number): Promise<boolean> {
    const cachedCanRead = await this.canReadCache.get({ workspaceID, creatorID });

    if (cachedCanRead !== null) {
      return cachedCanRead;
    }

    const client = await this.services.voiceflow.getClientByUserID(creatorID);
    const canRead = await client.workspace.canRead(creatorID, workspaceID);

    await this.canReadCache.set({ workspaceID, creatorID }, canRead);

    return canRead;
  }
}

export default WorkspaceService;
