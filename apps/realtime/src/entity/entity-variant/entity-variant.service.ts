import { Primary } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { LoguxService } from '@voiceflow/nestjs-logux';
import type { AssistantEntity, EntityEntity, EntityVariantEntity, PKOrEntity } from '@voiceflow/orm-designer';
import { AssistantORM, EntityORM, EntityVariantORM } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { EntitySerializer, MutableService } from '@/common';
import type { CreateManyData } from '@/common/types';
import { broadcastContext, groupByAssistant, toEntityIDs } from '@/common/utils';

@Injectable()
export class EntityVariantService extends MutableService<EntityVariantORM> {
  constructor(
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

  findManyByAssistant(assistant: PKOrEntity<AssistantEntity>) {
    return this.orm.findManyByAssistant(assistant);
  }

  /* Create */

  async createManyAndSync(data: CreateManyData<EntityVariantORM>) {
    const entityVariants = await this.createMany(data);

    return {
      add: { entityVariants },
    };
  }

  async broadcastAddMany({ add }: { add: { entityVariants: EntityVariantEntity[] } }) {
    await Promise.all(
      groupByAssistant(add.entityVariants).map((entityVariants) =>
        this.logux.process(
          Actions.EntityVariant.AddMany({
            data: this.entitySerializer.iterable(entityVariants),
            context: broadcastContext(entityVariants[0]),
          })
        )
      )
    );
  }

  async createManyAndBroadcast(data: CreateManyData<EntityVariantORM>) {
    const result = await this.createManyAndSync(data);

    await this.broadcastAddMany(result);

    return result.add.entityVariants;
  }

  /* Delete */

  async broadcastDeleteMany({ delete: del }: { delete: { entityVariants: EntityVariantEntity[] } }) {
    await Promise.all(
      groupByAssistant(del.entityVariants).map((entityVariants) =>
        this.logux.process(
          Actions.EntityVariant.DeleteMany({
            ids: toEntityIDs(entityVariants),
            context: broadcastContext(entityVariants[0]),
          })
        )
      )
    );
  }

  async deleteManyAndSync(ids: Primary<EntityVariantEntity>[]) {
    const entityVariants = await this.findMany(ids);

    await this.deleteMany(entityVariants);

    return {
      delete: { entityVariants },
    };
  }

  async deleteManyAndBroadcast(ids: Primary<EntityVariantEntity>[]) {
    const result = await this.deleteManyAndSync(ids);

    await this.broadcastDeleteMany(result);
  }
}
