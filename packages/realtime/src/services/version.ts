import { AbstractControl } from '../control';

class VersionService extends AbstractControl {
  private static getCanReadKey({ versionID, creatorID }: { versionID: string; creatorID: number }): string {
    return `versions:${versionID}:can-read:${creatorID}`;
  }

  private canReadCache = this.clients.cache.createKeyValue({
    adapter: this.clients.cache.adapters.booleanAdapter,
    keyCreator: VersionService.getCanReadKey,
  });

  public async canRead(versionID: string, creatorID: number): Promise<boolean> {
    const cachedCanRead = await this.canReadCache.get({ versionID, creatorID });

    if (cachedCanRead !== null) {
      return cachedCanRead;
    }

    const client = await this.services.voiceflow.getClientByUserID(creatorID);
    const canRead = await client.version.canRead(creatorID, versionID);

    await this.canReadCache.set({ versionID, creatorID }, canRead);

    return canRead;
  }
}

export default VersionService;
