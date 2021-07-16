import { AbstractControl } from '../control';
import { DEFAULT_EXPIRE_MODE, DEFAULT_EXPIRE_TIME } from './constants';

class WorkspaceService extends AbstractControl {
  private static getCanReadKey(workspaceID: string, userID: number): string {
    return `workspace:${workspaceID}:can-read:${userID}`;
  }

  private async getCachedCanRead(workspaceID: string, userID: number): Promise<boolean | null> {
    const cachedCanRead = await this.clients.redis.get(WorkspaceService.getCanReadKey(workspaceID, userID));

    return cachedCanRead === null ? null : Boolean(Number(cachedCanRead));
  }

  private async cacheCanRead(workspaceID: string, userID: number, canRead: boolean): Promise<void> {
    await this.clients.redis.set(WorkspaceService.getCanReadKey(workspaceID, userID), Number(canRead), DEFAULT_EXPIRE_MODE, DEFAULT_EXPIRE_TIME);
  }

  public async canRead(workspaceID: string, userID: number): Promise<boolean> {
    const cachedCanRead = await this.getCachedCanRead(workspaceID, userID);

    if (cachedCanRead !== null) {
      return cachedCanRead;
    }

    const canRead = await this.clients.api.workspace.canRead(userID, workspaceID);

    await this.cacheCanRead(workspaceID, userID, canRead);

    return canRead;
  }
}

export default WorkspaceService;
