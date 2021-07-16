import { AbstractControl } from '../control';
import { DEFAULT_EXPIRE_MODE, DEFAULT_EXPIRE_TIME } from './constants';

class VersionService extends AbstractControl {
  private static getCanReadKey(versionID: string, creatorID: number): string {
    return `versions:${versionID}:can-read:${creatorID}`;
  }

  private async getCachedCanRead(versionID: string, creatorID: number): Promise<boolean | null> {
    const cachedCanRead = await this.clients.redis.get(VersionService.getCanReadKey(versionID, creatorID));

    return cachedCanRead === null ? null : Boolean(Number(cachedCanRead));
  }

  private async cacheCanRead(versionID: string, creatorID: number, canRead: boolean): Promise<void> {
    await this.clients.redis.set(VersionService.getCanReadKey(versionID, creatorID), Number(canRead), DEFAULT_EXPIRE_MODE, DEFAULT_EXPIRE_TIME);
  }

  public async canRead(versionID: string, creatorID: number): Promise<boolean> {
    const cachedCanRead = await this.getCachedCanRead(versionID, creatorID);

    if (cachedCanRead !== null) {
      return cachedCanRead;
    }

    const canRead = await this.clients.api.version.canRead(creatorID, versionID);

    await this.cacheCanRead(versionID, creatorID, canRead);

    return canRead;
  }
}

export default VersionService;
