import { Primary } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { NotFoundException } from '@voiceflow/exception';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import type { AssistantEntity, EntityEntity, IntentEntity, ORMMutateOptions, PKOrEntity, RequiredEntityEntity } from '@voiceflow/orm-designer';
import { EntityORM, IntentORM, RequiredEntityORM } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { EntitySerializer, MutableService } from '@/common';
import type { CreateManyData } from '@/common/types';
import { assistantBroadcastContext, groupByAssistant, toEntityID, toEntityIDs } from '@/common/utils';

@Injectable()
export class RequiredEntityService extends MutableService<RequiredEntityORM> {
  constructor(
    @Inject(RequiredEntityORM)
    protected readonly orm: RequiredEntityORM,
    @Inject(IntentORM)
    protected readonly intentORM: IntentORM,
    @Inject(EntityORM)
    protected readonly entityORM: EntityORM,
    @Inject(LoguxService)
    protected readonly logux: LoguxService,
    @Inject(EntitySerializer)
    protected readonly entitySerializer: EntitySerializer
  ) {
    super();
  }

  /* Helpers */

  protected async syncIntents(requiredEntities: RequiredEntityEntity[], { flush = true, action }: { flush?: boolean; action: 'create' | 'delete' }) {
    const intentIDs = Utils.array.unique(requiredEntities.map(({ intent }) => ({ id: intent.id, environmentID: intent.environmentID })));

    const intents = await this.intentORM.findMany(intentIDs);

    if (intentIDs.length !== intents.length) {
      throw new NotFoundException("couldn't find intent to sync");
    }

    const requiredEntitiesByIntentID = requiredEntities.reduce<Record<string, typeof requiredEntities>>((acc, entity) => {
      acc[entity.intent.id] ??= [];
      acc[entity.intent.id].push(entity);

      return acc;
    }, {});

    intents.forEach((intent) => {
      const entityIDs = requiredEntitiesByIntentID[intent.id]?.map(toEntityID);

      if (!entityIDs?.length) {
        throw new NotFoundException("couldn't find required entities for intent to sync");
      }

      let entityOrder: string[];

      if (action === 'create') {
        entityOrder = [...intent.entityOrder, ...entityIDs];
      } else {
        entityOrder = intent.entityOrder.filter((id) => !entityIDs.includes(id));
      }

      // eslint-disable-next-line no-param-reassign
      intent.entityOrder = entityOrder;
    });

    if (flush) {
      await this.orm.em.flush();
    }

    return intents;
  }

  async broadcastSync(authMeta: AuthMetaPayload, { sync }: { sync: { intents: IntentEntity[] } }) {
    await Promise.all(
      groupByAssistant(sync.intents).flatMap((intents) =>
        intents.map((intent) =>
          this.logux.processAs(
            Actions.Intent.PatchOne({
              id: intent.id,
              patch: { entityOrder: intent.entityOrder },
              context: assistantBroadcastContext(intent),
            }),
            authMeta
          )
        )
      )
    );
  }

  /* Find */

  findManyByIntents(intents: PKOrEntity<IntentEntity>[]) {
    return this.orm.findManyByIntents(intents);
  }

  findManyByEntities(entities: PKOrEntity<EntityEntity>[]) {
    return this.orm.findManyByEntities(entities);
  }

  findManyByAssistant(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.orm.findManyByAssistant(assistant, environmentID);
  }

  /* Create */

  async createManyAndSync(data: CreateManyData<RequiredEntityORM>) {
    const requiredEntities = await this.createMany(data, { flush: false });
    const intents = await this.syncIntents(requiredEntities, { flush: false, action: 'create' });

    await this.orm.em.flush();

    return {
      add: { requiredEntities },
      sync: { intents },
    };
  }

  async broadcastAddMany(
    authMeta: AuthMetaPayload,
    { add, sync }: { add: { requiredEntities: RequiredEntityEntity[] }; sync: { intents: IntentEntity[] } }
  ) {
    await Promise.all([
      ...groupByAssistant(add.requiredEntities).map((requiredEntities) =>
        this.logux.processAs(
          Actions.RequiredEntity.AddMany({
            data: this.entitySerializer.iterable(requiredEntities),
            context: assistantBroadcastContext(requiredEntities[0]),
          }),
          authMeta
        )
      ),
      this.broadcastSync(authMeta, { sync }),
    ]);
  }

  async createManyAndBroadcast(authMeta: AuthMetaPayload, data: CreateManyData<RequiredEntityORM>) {
    const result = await this.createManyAndSync(data);

    await this.broadcastAddMany(authMeta, result);

    return result.add.requiredEntities;
  }

  /* Delete */

  async syncOnDelete(requiredEntities: RequiredEntityEntity[], options?: ORMMutateOptions) {
    const intents = await this.syncIntents(requiredEntities, { ...options, action: 'delete' });

    return { intents };
  }

  async deleteManyAndSync(ids: Primary<RequiredEntityEntity>[]) {
    const requiredEntities = await this.findMany(ids);

    const sync = await this.syncOnDelete(requiredEntities, { flush: false });

    await this.deleteMany(requiredEntities, { flush: false });

    await this.orm.em.flush();

    return {
      sync,
      delete: { requiredEntities },
    };
  }

  async broadcastDeleteMany(
    authMeta: AuthMetaPayload,
    { sync, delete: del }: { sync: { intents: IntentEntity[] }; delete: { requiredEntities: RequiredEntityEntity[] } }
  ) {
    await Promise.all([
      this.broadcastSync(authMeta, { sync }),
      ...groupByAssistant(del.requiredEntities).map((requiredEntities) =>
        this.logux.processAs(
          Actions.RequiredEntity.DeleteMany({
            ids: toEntityIDs(requiredEntities),
            context: assistantBroadcastContext(requiredEntities[0]),
          }),
          authMeta
        )
      ),
    ]);
  }

  async deleteManyAndBroadcast(authMeta: AuthMetaPayload, ids: Primary<RequiredEntityEntity>[]) {
    const result = await this.deleteManyAndSync(ids);

    await this.broadcastDeleteMany(authMeta, result);
  }
}
