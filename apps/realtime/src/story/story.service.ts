/* eslint-disable max-params */
import { Primary } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { LoguxService } from '@voiceflow/nestjs-logux';
import type { AnyTriggerEntity, ORMMutateOptions, PKOrEntity, StoryEntity } from '@voiceflow/orm-designer';
import { AssistantORM, FolderORM, StoryORM } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { EntitySerializer, TabularService } from '@/common';
import type { CreateManyForUserData } from '@/common/types';
import { broadcastContext, groupByAssistant, toEntityIDs } from '@/common/utils';

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

  /* Create */

  async createManyAndSync(userID: number, data: CreateManyForUserData<StoryORM>) {
    const stories = await this.createManyForUser(userID, data);

    return {
      add: { stories },
    };
  }

  async broadcastAddMany({ add }: { add: { stories: StoryEntity[] } }) {
    await Promise.all([
      ...groupByAssistant(add.stories).map((stories) =>
        this.logux.process(
          Actions.Story.AddMany({
            data: this.entitySerializer.iterable(stories),
            context: broadcastContext(stories[0]),
          })
        )
      ),
    ]);
  }

  async createManyAndBroadcast(userID: number, data: CreateManyForUserData<StoryORM>) {
    const result = await this.createManyAndSync(userID, data);

    await this.broadcastAddMany(result);

    return result.add.stories;
  }

  /* Delete */

  async collectRelationsToDelete(stories: PKOrEntity<StoryEntity>[]) {
    const triggers = await this.trigger.findManyByStories(stories);

    return {
      triggers,
    };
  }

  async deleteManyWithRelations(
    { stories, triggers }: { stories: PKOrEntity<StoryEntity>[]; triggers: PKOrEntity<AnyTriggerEntity>[] },
    { flush = true }: ORMMutateOptions = {}
  ) {
    await Promise.all([this.trigger.deleteMany(triggers, { flush: false }), this.deleteMany(stories, { flush: false })]);

    if (flush) {
      await this.orm.em.flush();
    }
  }

  async broadcastDeleteMany({ delete: del }: { delete: { stories: StoryEntity[]; triggers: AnyTriggerEntity[] } }) {
    await Promise.all([
      this.trigger.broadcastDeleteMany({
        // no need to sync intents, since they should be synced in the create method
        sync: { stories: [] },
        delete: Utils.object.pick(del, ['triggers']),
      }),
      ...groupByAssistant(del.stories).map((stories) =>
        this.logux.process(
          Actions.Story.DeleteMany({
            ids: toEntityIDs(stories),
            context: broadcastContext(stories[0]),
          })
        )
      ),
    ]);
  }

  async deleteManyAndSync(ids: Primary<StoryEntity>[]) {
    const stories = await this.findMany(ids);

    const relations = await this.collectRelationsToDelete(stories);

    await this.deleteManyWithRelations({ ...relations, stories });

    return {
      delete: { ...relations, stories },
    };
  }

  async deleteManyAndBroadcast(ids: Primary<StoryEntity>[]) {
    const result = await this.deleteManyAndSync(ids);

    await this.broadcastDeleteMany(result);
  }
}
