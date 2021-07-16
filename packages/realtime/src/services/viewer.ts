import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractControl } from '../control';

class ViewerService extends AbstractControl {
  private static getViewerKey(viewerID: string): string {
    return `viewers:${viewerID}`;
  }

  private static getViewerEntityKey(viewerID: string): string {
    return `viewers:${viewerID}:entities`;
  }

  public async addViewer(viewerID: string, lockEntity: string, viewer: Realtime.Viewer): Promise<void> {
    await Promise.all([
      this.clients.redis.sadd(ViewerService.getViewerEntityKey(viewerID), lockEntity),
      this.clients.redis.hset(ViewerService.getViewerKey(viewerID), { ...viewer, creatorID: String(viewer.creatorID) }),
    ]);
  }

  public async removeViewer(viewerID: string, lockEntity: string): Promise<void> {
    await this.clients.redis.srem(ViewerService.getViewerEntityKey(viewerID), lockEntity);

    const size = await this.clients.redis.scard(ViewerService.getViewerEntityKey(viewerID));

    // remove viewer from the cache only if it's not locked by other entities
    if (size === 0) {
      await this.clients.redis.del(ViewerService.getViewerKey(viewerID));
    }
  }

  public async getViewer(viewerID: string): Promise<null | Realtime.Viewer> {
    const cachedViewer = await this.clients.redis.hgetall(ViewerService.getViewerKey(viewerID));

    if (!cachedViewer) {
      return null;
    }

    return {
      ...cachedViewer,
      creatorID: Number(cachedViewer.creatorID),
    } as Realtime.Viewer;
  }

  public async getViewers(viewerIDs: string[]): Promise<Realtime.Viewer[]> {
    if (!viewerIDs.length) {
      return [];
    }

    const cachedViewers = await Promise.all(viewerIDs.map((viewerID) => this.getViewer(viewerID)));

    return cachedViewers.filter(Boolean) as Realtime.Viewer[];
  }
}

export default ViewerService;
