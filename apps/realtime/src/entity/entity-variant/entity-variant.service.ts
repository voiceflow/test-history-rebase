import type { EntityManager } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { LoguxService } from '@voiceflow/nestjs-logux';
import type { EntityVariantObject } from '@voiceflow/orm-designer';
import { AssistantORM, DatabaseTarget, EntityORM, EntityVariantORM } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { CMSObjectService } from '@/common';
import type { CMSCreateForUserData } from '@/common/types';
import { cmsBroadcastContext, injectAssistantAndEnvironmentIDs, toPostgresEntityIDs } from '@/common/utils';
import { CMSBroadcastMeta, CMSContext } from '@/types';

@Injectable()
export class EntityVariantService extends CMSObjectService<EntityVariantORM> {
  toJSON = this.orm.jsonAdapter.fromDB;

  fromJSON = this.orm.jsonAdapter.toDB;

  mapToJSON = this.orm.jsonAdapter.mapFromDB;

  mapFromJSON = this.orm.jsonAdapter.mapToDB;

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
    protected readonly logux: LoguxService
  ) {
    super();
  }

  /* Find */

  findManyByEntities(environmentID: string, entityIDs: string[]) {
    return this.orm.findManyByEntities(environmentID, entityIDs);
  }

  findManyByEnvironment(environmentID: string) {
    return this.orm.findManyByEnvironment(environmentID);
  }

  findManyByEnvironmentAndIDs(environmentID: string, ids: string[]) {
    return this.orm.findManyByEnvironmentAndIDs(environmentID, ids);
  }

  /* Create */

  async createManyAndSync(data: CMSCreateForUserData<EntityVariantORM>[], { userID, context }: { userID: number; context: CMSContext }) {
    const entityVariants = await this.createManyForUser(userID, data.map(injectAssistantAndEnvironmentIDs(context)));

    return {
      add: { entityVariants },
    };
  }

  async broadcastAddMany({ add }: { add: { entityVariants: EntityVariantObject[] } }, meta: CMSBroadcastMeta) {
    await this.logux.processAs(
      Actions.EntityVariant.AddMany({
        data: this.mapToJSON(add.entityVariants),
        context: cmsBroadcastContext(meta.context),
      }),
      meta.auth
    );
  }

  async createManyAndBroadcast(data: CMSCreateForUserData<EntityVariantORM>[], meta: CMSBroadcastMeta) {
    const result = await this.createManyAndSync(data, { userID: meta.auth.userID, context: meta.context });

    await this.broadcastAddMany(result, meta);

    return result.add.entityVariants;
  }

  /* Delete */

  deleteManyByEnvironmentAndIDs(environmentID: string, ids: string[]) {
    return this.orm.deleteManyByEnvironmentAndIDs(environmentID, ids);
  }

  async broadcastDeleteMany({ delete: del }: { delete: { entityVariants: EntityVariantObject[] } }, meta: CMSBroadcastMeta) {
    await this.logux.processAs(
      Actions.EntityVariant.DeleteMany({
        ids: toPostgresEntityIDs(del.entityVariants),
        context: cmsBroadcastContext(meta.context),
      }),
      meta.auth
    );
  }

  async deleteManyAndSync(ids: string[], context: CMSContext) {
    return this.postgresEM.transactional(async () => {
      const entityVariants = await this.findManyByEnvironmentAndIDs(context.environmentID, ids);

      await this.deleteManyByEnvironmentAndIDs(context.environmentID, ids);

      return {
        delete: { entityVariants },
      };
    });
  }

  async deleteManyAndBroadcast(ids: string[], meta: CMSBroadcastMeta) {
    const result = await this.deleteManyAndSync(ids, meta.context);

    await this.broadcastDeleteMany(result, meta);
  }
}
