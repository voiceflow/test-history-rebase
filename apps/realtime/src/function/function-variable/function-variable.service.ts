import type { EntityManager } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { LoguxService } from '@voiceflow/nestjs-logux';
import type { FunctionVariableObject } from '@voiceflow/orm-designer';
import { AssistantORM, DatabaseTarget, FunctionVariableORM } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { CMSObjectService } from '@/common';
import type { CMSCreateForUserData } from '@/common/types';
import { cmsBroadcastContext, injectAssistantAndEnvironmentIDs, toPostgresEntityIDs } from '@/common/utils';
import { CMSBroadcastMeta, CMSContext } from '@/types';

@Injectable()
export class FunctionVariableService extends CMSObjectService<FunctionVariableORM> {
  toJSON = this.orm.jsonAdapter.fromDB;

  fromJSON = this.orm.jsonAdapter.toDB;

  mapToJSON = this.orm.jsonAdapter.mapFromDB;

  mapFromJSON = this.orm.jsonAdapter.mapToDB;

  constructor(
    @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
    private readonly postgresEM: EntityManager,
    @Inject(FunctionVariableORM)
    protected readonly orm: FunctionVariableORM,
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
    data: CMSCreateForUserData<FunctionVariableORM>[],
    { userID, context }: { userID: number; context: CMSContext }
  ) {
    return this.postgresEM.transactional(async () => {
      const functionVariables = await this.createManyForUser(
        userID,
        data.map(injectAssistantAndEnvironmentIDs(context))
      );

      return {
        add: { functionVariables },
      };
    });
  }

  async broadcastAddMany({ add }: { add: { functionVariables: FunctionVariableObject[] } }, meta: CMSBroadcastMeta) {
    await this.logux.processAs(
      Actions.FunctionVariable.AddMany({
        data: this.mapToJSON(add.functionVariables),
        context: cmsBroadcastContext(meta.context),
      }),
      meta.auth
    );
  }

  async createManyAndBroadcast(data: CMSCreateForUserData<FunctionVariableORM>[], meta: CMSBroadcastMeta) {
    const result = await this.createManyAndSync(data, { userID: meta.auth.userID, context: meta.context });

    await this.broadcastAddMany(result, meta);

    return result.add.functionVariables;
  }

  /* Delete */

  deleteManyByEnvironmentAndIDs(environmentID: string, ids: string[]) {
    return this.orm.deleteManyByEnvironmentAndIDs(environmentID, ids);
  }

  async broadcastDeleteMany(
    { delete: del }: { delete: { functionVariables: FunctionVariableObject[] } },
    meta: CMSBroadcastMeta
  ) {
    await this.logux.processAs(
      Actions.FunctionVariable.DeleteMany({
        ids: toPostgresEntityIDs(del.functionVariables),
        context: cmsBroadcastContext(meta.context),
      }),
      meta.auth
    );
  }

  async deleteManyAndSync(ids: string[], context: CMSContext) {
    return this.postgresEM.transactional(async () => {
      const functionVariables = await this.findManyByEnvironmentAndIDs(context.environmentID, ids);

      await this.deleteManyByEnvironmentAndIDs(context.environmentID, ids);

      return {
        delete: { functionVariables },
      };
    });
  }

  async deleteManyAndBroadcast(ids: string[], meta: CMSBroadcastMeta) {
    const result = await this.deleteManyAndSync(ids, meta.context);

    await this.broadcastDeleteMany(result, meta);
  }
}
