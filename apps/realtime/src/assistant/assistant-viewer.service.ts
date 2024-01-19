import { RedisService } from '@liaoliaots/nestjs-redis';
import { Inject, Injectable } from '@nestjs/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import type { Redis } from 'ioredis';

import { UserService } from '@/user/user.service';

import { AssistantViewerDTO } from './dtos/assistant-viewer';

@Injectable()
export class AssistantViewerService {
  private redis: Redis;

  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
    @Inject(RedisService)
    private readonly redisService: RedisService
  ) {
    this.redis = this.redisService.getClient();
  }

  private static getAssistantCacheKey({ assistantID, environmentID }: { assistantID: string; environmentID: string }): string {
    return `assistant-viewers:${assistantID}:${environmentID}`;
  }

  private static getViewerCacheKey({ viewerID }: { viewerID: number }): string {
    return `assistant-viewer:${viewerID}`;
  }

  public async addViewerCache({
    viewer,
    viewerID,
    assistantID,
    environmentID,
  }: {
    viewer: Realtime.Viewer;
    viewerID: number;
    assistantID: string;
    environmentID: string;
  }): Promise<void> {
    const pipeline = this.redis.pipeline();

    const assistantCacheKey = AssistantViewerService.getAssistantCacheKey({ assistantID, environmentID });
    const viewerCacheKey = AssistantViewerService.getViewerCacheKey({ viewerID });

    pipeline.sadd(assistantCacheKey, viewerID);
    pipeline.hmset(viewerCacheKey, viewer);

    await pipeline.exec();
  }

  public async removeViewer({
    viewerID,
    assistantID,
    environmentID,
  }: {
    viewerID: number;
    assistantID: string;
    environmentID: string;
  }): Promise<void> {
    const pipeline = this.redis.pipeline();

    const assistantCacheKey = AssistantViewerService.getAssistantCacheKey({ assistantID, environmentID });
    const viewerCacheKey = AssistantViewerService.getViewerCacheKey({ viewerID });

    pipeline.srem(assistantCacheKey, viewerID);
    pipeline.del(viewerCacheKey);

    await pipeline.exec();
  }

  public async getAllViewers({ assistantID, environmentID }: { assistantID: string; environmentID: string }): Promise<Realtime.Viewer[]> {
    const assistantCacheKey = AssistantViewerService.getAssistantCacheKey({ assistantID, environmentID });
    const viewerIDs = await this.redis.smembers(assistantCacheKey);

    if (viewerIDs.length === 0) {
      return [];
    }

    const pipeline = this.redis.pipeline();

    viewerIDs.forEach((viewerID) => {
      const viewerCacheKey = AssistantViewerService.getViewerCacheKey({ viewerID: Number(viewerID) });

      pipeline.hgetall(viewerCacheKey);
    });

    const results = await pipeline.exec();

    if (!results) return [];

    return results
      .map<Realtime.Viewer | null>(([err, data]) => {
        if (err) return null;

        const result = AssistantViewerDTO.safeParse(data);

        if (!result.success) return null;

        return {
          name: result.data.name,
          image: result.data.image || undefined,
          creatorID: Number(result.data.creatorID),
        };
      })
      .filter((viewer): viewer is Realtime.Viewer => viewer !== null);
  }

  public async addViewer({ viewerID, assistantID, environmentID }: { viewerID: number; assistantID: string; environmentID: string }): Promise<void> {
    const user = await this.userService.getByID(Number(viewerID));

    if (!user) return;

    const viewer: Realtime.Viewer = {
      name: user.name,
      image: user.image ?? undefined,
      creatorID: user.creator_id,
    };

    await this.addViewerCache({ viewer, viewerID, assistantID, environmentID });
  }
}
