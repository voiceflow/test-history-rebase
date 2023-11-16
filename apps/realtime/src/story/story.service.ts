/* eslint-disable max-params */
import { Primary } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import type { AnyTriggerEntity, ORMMutateOptions, PKOrEntity, StoryEntity } from '@voiceflow/orm-designer';
import { AssistantORM, FolderORM, StoryORM } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { EntitySerializer, TabularService } from '@/common';
import type { CreateManyForUserData } from '@/common/types';
import { assistantBroadcastContext, groupByAssistant, toEntityIDs } from '@/common/utils';
import { cloneManyEntities } from '@/utils/entity.util';

import { TriggerService } from './trigger/trigger.service';

@Injectable()
export class StoryService extends TabularService<StoryORM> {
  constructor(
    @Inject(StoryORM)
    protected readonly orm: StoryORM,
    @Inject(FolderORM)
    protected readonly folderORM: FolderORM,
    @Inject(AssistantORM)
    protected readonly assistantORM: AssistantORM,
    @Inject(LoguxService)
    protected readonly logux: LoguxService,
    @Inject(TriggerService)
    protected readonly trigger: TriggerService,
    @Inject(EntitySerializer)
    protected readonly entitySerializer: EntitySerializer
  ) {
    super();
  }

  /* Find */

  async findManyWithSubResourcesByAssistant(assistantID: string, environmentID: string) {
    const [stories, triggers] = await Promise.all([
      this.findManyByAssistant(assistantID, environmentID),
      this.trigger.findManyByAssistant(assistantID, environmentID),
    ]);

    return {
      stories,
      triggers,
    };
  }

  /* Clone */

  async cloneManyWithSubResourcesForEnvironment(
    {
      assistantID,
      sourceEnvironmentID,
      targetEnvironmentID,
    }: {
      assistantID: string;
      sourceEnvironmentID: string;
      targetEnvironmentID: string;
    },
    { flush = true }: ORMMutateOptions = {}
  ) {
    const [{ stories: sourceStories, triggers: sourceTriggers }, { stories: targetStories, triggers: targetTriggers }] = await Promise.all([
      this.findManyWithSubResourcesByAssistant(assistantID, sourceEnvironmentID),
      this.findManyWithSubResourcesByAssistant(assistantID, targetEnvironmentID),
    ]);

    await Promise.all([this.deleteMany(targetStories, { flush: false }), this.trigger.deleteMany(targetTriggers, { flush: false })]);

    const [stories, triggers] = await Promise.all([
      this.createMany(cloneManyEntities(sourceStories, { environmentID: targetEnvironmentID }), { flush: false }),
      this.trigger.createMany(cloneManyEntities(sourceTriggers, { environmentID: targetEnvironmentID }), { flush: false }),
    ]);

    if (flush) {
      await this.orm.em.flush();
    }

    return {
      stories,
      triggers,
    };
  }

  /* Create */

  async createManyAndSync(userID: number, data: CreateManyForUserData<StoryORM>) {
    const stories = await this.createManyForUser(userID, data);

    return {
      add: { stories },
    };
  }

  async broadcastAddMany(authMeta: AuthMetaPayload, { add }: { add: { stories: StoryEntity[] } }) {
    await Promise.all([
      ...groupByAssistant(add.stories).map((stories) =>
        this.logux.processAs(
          Actions.Story.AddMany({
            data: this.entitySerializer.iterable(stories),
            context: assistantBroadcastContext(stories[0]),
          }),
          authMeta
        )
      ),
    ]);
  }

  async createManyAndBroadcast(authMeta: AuthMetaPayload, data: CreateManyForUserData<StoryORM>) {
    const result = await this.createManyAndSync(authMeta.userID, data);

    await this.broadcastAddMany(authMeta, result);

    return result.add.stories;
  }

  /* Delete */

  async collectRelationsToDelete(stories: PKOrEntity<StoryEntity>[]) {
    const triggers = await this.trigger.findManyByStories(stories);

    return {
      triggers,
    };
  }

  async broadcastDeleteMany(authMeta: AuthMetaPayload, { delete: del }: { delete: { stories: StoryEntity[]; triggers: AnyTriggerEntity[] } }) {
    await Promise.all([
      this.trigger.broadcastDeleteMany(authMeta, {
        // no need to sync intents, since they should be synced in the create method
        sync: { stories: [] },
        delete: Utils.object.pick(del, ['triggers']),
      }),
      ...groupByAssistant(del.stories).map((stories) =>
        this.logux.processAs(
          Actions.Story.DeleteMany({
            ids: toEntityIDs(stories),
            context: assistantBroadcastContext(stories[0]),
          }),
          authMeta
        )
      ),
    ]);
  }

  async deleteManyAndSync(ids: Primary<StoryEntity>[]) {
    const stories = await this.findMany(ids);

    const relations = await this.collectRelationsToDelete(stories);

    await this.deleteMany(stories);

    return {
      delete: { ...relations, stories },
    };
  }

  async deleteManyAndBroadcast(authMeta: AuthMetaPayload, ids: Primary<StoryEntity>[]) {
    const result = await this.deleteManyAndSync(ids);

    await this.broadcastDeleteMany(authMeta, result);
  }
}
