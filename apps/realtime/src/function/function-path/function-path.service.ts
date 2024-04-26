import type { EntityManager } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { LoguxService } from '@voiceflow/nestjs-logux';
import type { FunctionPathObject } from '@voiceflow/orm-designer';
import { AssistantORM, DatabaseTarget, FunctionPathORM } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { CMSObjectService } from '@/common';
import type { CMSCreateForUserData } from '@/common/types';
import { cmsBroadcastContext, injectAssistantAndEnvironmentIDs, toPostgresEntityIDs } from '@/common/utils';
import { CMSBroadcastMeta, CMSContext } from '@/types';

@Injectable()
export class FunctionPathService extends CMSObjectService<FunctionPathORM> {
  toJSON = this.orm.jsonAdapter.fromDB;

  fromJSON = this.orm.jsonAdapter.toDB;

  mapToJSON = this.orm.jsonAdapter.mapFromDB;

  mapFromJSON = this.orm.jsonAdapter.mapToDB;

  constructor(
    @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
    private readonly postgresEM: EntityManager,
    @Inject(FunctionPathORM)
    protected readonly orm: FunctionPathORM,
    @Inject(LoguxService)
    protected readonly logux: LoguxService,
    @Inject(AssistantORM)
    protected readonly assistantORM: AssistantORM
  ) {
    super();
  }

  findManyByFunctions(environmentID: string, functionIDs: string[]) {
    return this.orm.findManyByFunctions(environmentID, functionIDs);
  }

  findManyByEnvironment(environmentID: string) {
    return this.orm.findManyByEnvironment(environmentID);
  }

  findManyByEnvironmentAndIDs(environmentID: string, ids: string[]) {
    return this.orm.findManyByEnvironmentAndIDs(environmentID, ids);
  }

  /* Create */

  async createManyAndSync(
    data: CMSCreateForUserData<FunctionPathORM>[],
    { userID, context }: { userID: number; context: CMSContext }
  ) {
    const functionPaths = await this.createManyForUser(userID, data.map(injectAssistantAndEnvironmentIDs(context)));

    return {
      add: { functionPaths },
    };
  }

  async broadcastAddMany({ add }: { add: { functionPaths: FunctionPathObject[] } }, meta: CMSBroadcastMeta) {
    await this.logux.processAs(
      Actions.FunctionPath.AddMany({
        data: this.mapToJSON(add.functionPaths),
        context: cmsBroadcastContext(meta.context),
      }),
      meta.auth
    );
  }

  async createManyAndBroadcast(data: CMSCreateForUserData<FunctionPathORM>[], meta: CMSBroadcastMeta) {
    const result = await this.createManyAndSync(data, { userID: meta.auth.userID, context: meta.context });

    await this.broadcastAddMany(result, meta);

    return result.add.functionPaths;
  }

  /* Delete */

  deleteManyByEnvironmentAndIDs(environmentID: string, ids: string[]) {
    return this.orm.deleteManyByEnvironmentAndIDs(environmentID, ids);
  }

  async broadcastDeleteMany(
    { delete: del }: { delete: { functionPaths: FunctionPathObject[] } },
    meta: CMSBroadcastMeta
  ) {
    await this.logux.processAs(
      Actions.FunctionPath.DeleteMany({
        ids: toPostgresEntityIDs(del.functionPaths),
        context: cmsBroadcastContext(meta.context),
      }),
      meta.auth
    );
  }

  async deleteManyAndSync(ids: string[], context: CMSContext) {
    return this.postgresEM.transactional(async () => {
      const functionPaths = await this.findManyByEnvironmentAndIDs(context.environmentID, ids);

      await this.deleteManyByEnvironmentAndIDs(context.environmentID, ids);

      return {
        delete: { functionPaths },
      };
    });
  }

  async deleteManyAndBroadcast(ids: string[], meta: CMSBroadcastMeta) {
    const result = await this.deleteManyAndSync(ids, meta.context);

    await this.broadcastDeleteMany(result, meta);
  }
}
