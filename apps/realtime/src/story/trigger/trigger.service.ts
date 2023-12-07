/* eslint-disable max-params */
import { Primary } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { NotFoundException } from '@voiceflow/exception';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import type {
  AnyTriggerEntity,
  AssistantEntity,
  IntentEntity,
  IntentTriggerEntity,
  ORMMutateOptions,
  PKOrEntity,
  StoryEntity,
} from '@voiceflow/orm-designer';
import { StoryORM, TriggerORM, TriggerTarget } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';
import { match } from 'ts-pattern';

import { EntitySerializer } from '@/common';
import type { PatchManyData, PatchOneData } from '@/common/types';
import { assistantBroadcastContext, groupByAssistant, toEntityID, toEntityIDs } from '@/common/utils';

import { EventTriggerService } from './event-trigger.service';
import { IntentTriggerService } from './intent-trigger.service';
import type { TriggerAnyCreateData } from './trigger.interface';

@Injectable()
export class TriggerService {
  constructor(
    @Inject(TriggerORM)
    protected readonly orm: TriggerORM,
    @Inject(StoryORM)
    protected readonly storyORM: StoryORM,
    @Inject(LoguxService)
    protected readonly logux: LoguxService,
    @Inject(EventTriggerService)
    protected readonly eventTrigger: EventTriggerService,
    @Inject(IntentTriggerService)
    protected readonly intentTrigger: IntentTriggerService,
    @Inject(EntitySerializer)
    private readonly entitySerializer: EntitySerializer
  ) {}

  /* Helpers */

  protected async syncStories(triggers: AnyTriggerEntity[], { flush = true, action }: { flush?: boolean; action: 'create' | 'delete' }) {
    const storyIDs = Utils.array.unique(triggers.map(({ story }) => ({ id: story.id, environmentID: story.environmentID })));

    const stories = await this.storyORM.findMany(storyIDs);

    if (storyIDs.length !== stories.length) {
      throw new NotFoundException("couldn't find story to sync");
    }

    const triggersByStoryID = triggers.reduce<Record<string, typeof triggers>>((acc, trigger) => {
      acc[trigger.story.id] ??= [];
      acc[trigger.story.id].push(trigger);

      return acc;
    }, {});

    stories.forEach((story) => {
      const triggerIDs = triggersByStoryID[story.id]?.map(toEntityID);

      if (!triggerIDs?.length) {
        throw new NotFoundException("couldn't find triggers for story to sync");
      }

      let triggerOrder: string[];

      if (action === 'create') {
        triggerOrder = [...story.triggerOrder, ...triggerIDs];
      } else {
        triggerOrder = story.triggerOrder.filter((id) => !triggerIDs.includes(id));
      }

      // eslint-disable-next-line no-param-reassign
      story.triggerOrder = triggerOrder;
    });

    if (flush) {
      await this.orm.em.flush();
    }

    return stories;
  }

  async broadcastSync(authMeta: AuthMetaPayload, { sync }: { sync: { stories: StoryEntity[] } }) {
    await Promise.all(
      groupByAssistant(sync.stories).flatMap((stories) =>
        stories.map((story) =>
          this.logux.processAs(
            Actions.Story.PatchOne({
              id: story.id,
              patch: { triggerOrder: story.triggerOrder },
              context: assistantBroadcastContext(story),
            }),
            authMeta
          )
        )
      )
    );
  }

  /* Find */

  findMany(ids: Primary<StoryEntity>[]): Promise<AnyTriggerEntity[]> {
    return this.orm.findMany(ids);
  }

  findOneOrFail(id: Primary<StoryEntity>): Promise<AnyTriggerEntity> {
    return this.orm.findOneOrFail(id);
  }

  findManyByStories(stories: PKOrEntity<StoryEntity>[]): Promise<AnyTriggerEntity[]> {
    return this.orm.find({ story: stories });
  }

  findManyByIntents(intents: PKOrEntity<IntentEntity>[]) {
    return this.orm.find({ intent: intents }) as Promise<IntentTriggerEntity[]>;
  }

  findManyByAssistant(assistant: PKOrEntity<AssistantEntity>, environmentID: string): Promise<AnyTriggerEntity[]> {
    return this.orm.findManyByAssistant(assistant, environmentID);
  }

  /* Create */

  createOne(data: TriggerAnyCreateData & { updatedByID: number | null }, options?: ORMMutateOptions) {
    return match(data)
      .with({ target: TriggerTarget.EVENT }, (data) => this.eventTrigger.createOne(data, options))
      .with({ target: TriggerTarget.INTENT }, (data) => this.intentTrigger.createOne(data, options))
      .exhaustive();
  }

  async createMany(data: Array<TriggerAnyCreateData & { updatedByID: number | null }>, { flush = true }: ORMMutateOptions = {}) {
    const result = await Promise.all(data.map((item) => this.createOne(item, { flush: false })));

    if (flush) {
      await this.orm.em.flush();
    }

    return result;
  }

  createOneForUser(userID: number, data: TriggerAnyCreateData, options?: ORMMutateOptions) {
    return match(data)
      .with({ target: TriggerTarget.EVENT }, (data) => this.eventTrigger.createOneForUser(userID, data, options))
      .with({ target: TriggerTarget.INTENT }, (data) => this.intentTrigger.createOneForUser(userID, data, options))
      .exhaustive();
  }

  async createManyForUser(userID: number, data: Array<TriggerAnyCreateData>, { flush = true }: ORMMutateOptions = {}) {
    const result = await Promise.all(data.map((item) => this.createOneForUser(userID, item, { flush: false })));

    if (flush) {
      await this.orm.em.flush();
    }

    return result;
  }

  async createManyAndSync(userID: number, data: TriggerAnyCreateData[]) {
    const triggers = await this.createManyForUser(userID, data, { flush: false });
    const stories = await this.syncStories(triggers, { flush: false, action: 'create' });

    await this.orm.em.flush();

    return {
      add: { triggers },
      sync: { stories },
    };
  }

  async broadcastAddMany(authMeta: AuthMetaPayload, { add, sync }: { add: { triggers: AnyTriggerEntity[] }; sync: { stories: StoryEntity[] } }) {
    await Promise.all([
      ...groupByAssistant(add.triggers).map((triggers) =>
        this.logux.processAs(
          Actions.Trigger.AddMany({
            data: this.entitySerializer.iterable(triggers),
            context: assistantBroadcastContext(triggers[0]),
          }),
          authMeta
        )
      ),
      this.broadcastSync(authMeta, { sync }),
    ]);
  }

  async createManyAndBroadcast(authMeta: AuthMetaPayload, data: TriggerAnyCreateData[]) {
    const result = await this.createManyAndSync(authMeta.userID, data);

    await this.broadcastAddMany(authMeta, result);

    return result.add.triggers;
  }

  /* Update */

  patchOneForUser(userID: number, id: Primary<StoryEntity>, patch: PatchOneData<TriggerORM>) {
    return match(patch)
      .with({ target: TriggerTarget.EVENT }, (data) => this.eventTrigger.patchOneForUser(userID, id, data))
      .with({ target: TriggerTarget.INTENT }, (data) => this.intentTrigger.patchOneForUser(userID, id, data))
      .otherwise(() => this.orm.patchOneForUser(userID, id, patch));
  }

  patchManyForUser(userID: number, ids: Primary<StoryEntity>[], patch: PatchManyData<TriggerORM>) {
    return match(patch)
      .with({ target: TriggerTarget.EVENT }, (data) => this.eventTrigger.patchManyForUser(userID, ids, data))
      .with({ target: TriggerTarget.INTENT }, (data) => this.intentTrigger.patchManyForUser(userID, ids, data))
      .otherwise(() => this.orm.patchManyForUser(userID, ids, patch));
  }

  /* Delete */

  deleteMany(triggers: PKOrEntity<AnyTriggerEntity>[], options?: ORMMutateOptions) {
    return this.orm.deleteMany(triggers, options);
  }

  async syncOnDelete(triggers: AnyTriggerEntity[], options?: ORMMutateOptions) {
    const stories = await this.syncStories(triggers, { ...options, action: 'delete' });

    return { stories };
  }

  async deleteManyAndSync(ids: Primary<StoryEntity>[]) {
    const triggers = await this.findMany(ids);

    const sync = await this.syncOnDelete(triggers, { flush: false });

    await this.deleteMany(triggers, { flush: false });

    await this.orm.em.flush();

    return {
      sync,
      delete: { triggers },
    };
  }

  async broadcastDeleteMany(
    authMeta: AuthMetaPayload,
    { sync, delete: del }: { sync: { stories: StoryEntity[] }; delete: { triggers: AnyTriggerEntity[] } }
  ) {
    await Promise.all([
      this.broadcastSync(authMeta, { sync }),

      ...groupByAssistant(del.triggers).map((triggers) =>
        this.logux.processAs(
          Actions.Trigger.DeleteMany({
            ids: toEntityIDs(triggers),
            context: assistantBroadcastContext(triggers[0]),
          }),
          authMeta
        )
      ),
    ]);
  }

  async deleteManyAndBroadcast(authMeta: AuthMetaPayload, ids: Primary<StoryEntity>[]) {
    const result = await this.deleteManyAndSync(ids);

    await this.broadcastDeleteMany(authMeta, result);
  }
}
