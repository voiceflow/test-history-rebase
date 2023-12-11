import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { HEARTBEAT_EXPIRE_TIMEOUT } from '@/constants';

import { AbstractControl } from '../../control';
import { viewerAdapter } from './adapter';

class ViewerService extends AbstractControl {
  private static getViewerKey({ viewerID }: { viewerID: string }): string {
    return `viewers:${viewerID}`;
  }

  private static getViewerEntityKey({ viewerID }: { viewerID: string }): string {
    return `viewers:${viewerID}:entities`;
  }

  private viewersCache = this.clients.cache.createHash({ adapter: viewerAdapter, keyCreator: ViewerService.getViewerKey });

  private lockedEntitiesCache = this.clients.cache.createSet({
    // setting expire just to be sure that entity is not locked after service crash/restart
    expire: HEARTBEAT_EXPIRE_TIMEOUT,
    keyCreator: ViewerService.getViewerEntityKey,
  });

  public async addViewer(viewerID: string, lockEntity: string, viewer: Realtime.Viewer): Promise<void> {
    await Promise.all([this.lockedEntitiesCache.add({ viewerID }, lockEntity), this.viewersCache.set({ viewerID }, viewer)]);
  }

  public async removeViewer(viewerID: string, lockEntity: string): Promise<void> {
    await this.lockedEntitiesCache.remove({ viewerID }, lockEntity);

    const size = await this.lockedEntitiesCache.size({ viewerID });

    // remove viewer from the cache only if it's not locked by other entities
    if (size === 0) {
      await this.viewersCache.unlink({ viewerID });
    }
  }

  public async renewEntityExpire(viewerID: string): Promise<void> {
    await this.lockedEntitiesCache.renewExpire({ viewerID });
  }

  public async getViewer(viewerID: string): Promise<null | Realtime.Viewer> {
    return this.viewersCache.get({ viewerID });
  }

  public async getViewers(viewerIDs: string[]): Promise<Realtime.Viewer[]> {
    if (!viewerIDs.length) {
      return [];
    }

    const cachedViewers = await Promise.all(viewerIDs.map((viewerID) => this.getViewer(viewerID)));

    return cachedViewers.filter(Utils.array.isNotNullish);
  }
}

export default ViewerService;
