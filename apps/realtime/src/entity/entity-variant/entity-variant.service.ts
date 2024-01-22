/* eslint-disable max-params */
import type { EntityManager } from '@mikro-orm/core';
import { Primary } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import type { AssistantEntity, EntityEntity, EntityVariantEntity, PKOrEntity } from '@voiceflow/orm-designer';
import { AssistantORM, DatabaseTarget, EntityORM, EntityVariantORM } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { CMSObjectService, EntitySerializer } from '@/common';
import type { CreateManyForUserData } from '@/common/types';
import { assistantBroadcastContext, groupByAssistant, toEntityIDs } from '@/common/utils';

@Injectable()
export class EntityVariantService extends CMSObjectService<EntityVariantORM> {
  constructor(
    @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
    private readonly postgresEM: EntityManager,
    @Inject(EntityVariantORM)
    protected readonly orm: EntityVariantORM,
    @Inject(EntityORM)
    protected readonly entityORM: EntityORM,
    @Inject(AssistantORM)
    protected readonly assistantORM: AssistantORM,
    @Inject(LoguxService)
    protected readonly logux: LoguxService,
    @Inject(EntitySerializer)
    protected readonly entitySerializer: EntitySerializer
  ) {
    super();
  }

  /* Find */

  findManyByEntities(entities: PKOrEntity<EntityEntity>[]) {
    return this.orm.findManyByEntities(entities);
  }

  findManyByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.orm.findManyByEnvironment(assistant, environmentID);
  }

  /* Create */

  async createManyAndSync(userID: number, data: CreateManyForUserData<EntityVariantORM>) {
    return this.postgresEM.transactional(async () => {
      const entityVariants = await this.createManyForUser(userID, data);

      return {
        add: { entityVariants },
      };
    });
  }

  async broadcastAddMany(authMeta: AuthMetaPayload, { add }: { add: { entityVariants: EntityVariantEntity[] } }) {
    await Promise.all(
      groupByAssistant(add.entityVariants).map((entityVariants) =>
        this.logux.processAs(
          Actions.EntityVariant.AddMany({
            data: this.entitySerializer.iterable(entityVariants),
            context: assistantBroadcastContext(entityVariants[0]),
          }),
          authMeta
        )
      )
    );
  }

  async createManyAndBroadcast(authMeta: AuthMetaPayload, data: CreateManyForUserData<EntityVariantORM>) {
    const result = await this.createManyAndSync(authMeta.userID, data);

    await this.broadcastAddMany(authMeta, result);

    return result.add.entityVariants;
  }

  /* Delete */

  async broadcastDeleteMany(authMeta: AuthMetaPayload, { delete: del }: { delete: { entityVariants: EntityVariantEntity[] } }) {
    await Promise.all(
      groupByAssistant(del.entityVariants).map((entityVariants) =>
        this.logux.processAs(
          Actions.EntityVariant.DeleteMany({
            ids: toEntityIDs(entityVariants),
            context: assistantBroadcastContext(entityVariants[0]),
          }),
          authMeta
        )
      )
    );
  }

  async deleteManyAndSync(ids: Primary<EntityVariantEntity>[]) {
    return this.postgresEM.transactional(async () => {
      const entityVariants = await this.findMany(ids);

      await this.deleteMany(entityVariants);

      return {
        delete: { entityVariants },
      };
    });
  }

  async deleteManyAndBroadcast(authMeta: AuthMetaPayload, ids: Primary<EntityVariantEntity>[]) {
    const result = await this.deleteManyAndSync(ids);

    await this.broadcastDeleteMany(authMeta, result);
  }
}
