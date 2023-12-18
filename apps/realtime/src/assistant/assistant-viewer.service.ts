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

  private static getViewerCacheKey({ viewerID }: { viewerID: string }): string {
    return `assistant-viewer:${viewerID}`;
  }

  public async addViewerCache({
    viewerID,
    assistantID,
    environmentID,
    viewer,
  }: {
    viewerID: string;
    assistantID: string;
    environmentID: string;
    viewer: Realtime.Viewer;
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
    viewerID: string;
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
      const viewerCacheKey = AssistantViewerService.getViewerCacheKey({ viewerID });
      pipeline.hgetall(viewerCacheKey);
    });

    const results = await pipeline.exec();

    if (!results) return [];

    return results.map(([err, data], index) => {
      const viewerData = AssistantViewerDTO.parse(data);

      if (err) {
        throw err;
      }

      return {
        creatorID: Number(viewerIDs[index]),
        name: viewerData.name,
        image: viewerData.image,
      };
    });
  }

  public async addViewer({ viewerID, assistantID, environmentID }: { viewerID: string; assistantID: string; environmentID: string }): Promise<void> {
    const user = await this.userService.getByID(Number(viewerID));

    if (!user) return;

    const viewer: Realtime.Viewer = {
      creatorID: user.creator_id,
      name: user.name,
      image: user.image ?? '',
    };

    await this.addViewerCache({ viewerID, assistantID, environmentID, viewer });
  }
}
