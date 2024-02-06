import type { EntityManager } from '@mikro-orm/core';
import { Primary } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import type { AssistantEntity, FunctionEntity, FunctionVariableEntity, PKOrEntity } from '@voiceflow/orm-designer';
import { AssistantORM, DatabaseTarget, FunctionVariableORM } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { CMSObjectService, EntitySerializer } from '@/common';
import type { CreateManyForUserData } from '@/common/types';
import { assistantBroadcastContext, groupByAssistant, toEntityIDs } from '@/common/utils';

@Injectable()
export class FunctionVariableService extends CMSObjectService<FunctionVariableORM> {
  constructor(
    @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
    private readonly postgresEM: EntityManager,
    @Inject(FunctionVariableORM)
    protected readonly orm: FunctionVariableORM,
    @Inject(LoguxService)
    protected readonly logux: LoguxService,
    @Inject(EntitySerializer)
    protected readonly entitySerializer: EntitySerializer,
    @Inject(AssistantORM)
    protected readonly assistantORM: AssistantORM
  ) {
    super();
  }

  findManyByFunctions(functions: PKOrEntity<FunctionEntity>[]) {
    return this.orm.findManyByFunctions(functions);
  }

  findManyByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.orm.findManyByEnvironment(assistant, environmentID);
  }

  findManyJSONByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.orm.findAllJSON({ assistant, environmentID });
  }

  /* Create */

  async createManyAndSync(userID: number, data: CreateManyForUserData<FunctionVariableORM>) {
    return this.postgresEM.transactional(async () => {
      const functionVariables = await this.createManyForUser(userID, data);

      return {
        add: { functionVariables },
      };
    });
  }

  async broadcastAddMany(authMeta: AuthMetaPayload, { add }: { add: { functionVariables: FunctionVariableEntity[] } }) {
    await Promise.all(
      groupByAssistant(add.functionVariables).map((functionVariables) =>
        this.logux.processAs(
          Actions.FunctionVariable.AddMany({
            data: this.entitySerializer.iterable(functionVariables),
            context: assistantBroadcastContext(functionVariables[0]),
          }),
          authMeta
        )
      )
    );
  }

  async createManyAndBroadcast(authMeta: AuthMetaPayload, data: CreateManyForUserData<FunctionVariableORM>) {
    const result = await this.createManyAndSync(authMeta.userID, data);

    await this.broadcastAddMany(authMeta, result);

    return result.add.functionVariables;
  }

  /* Delete */

  async broadcastDeleteMany(authMeta: AuthMetaPayload, { delete: del }: { delete: { functionVariables: FunctionVariableEntity[] } }) {
    await Promise.all(
      groupByAssistant(del.functionVariables).map((functionVariables) =>
        this.logux.processAs(
          Actions.FunctionVariable.DeleteMany({
            ids: toEntityIDs(functionVariables),
            context: assistantBroadcastContext(functionVariables[0]),
          }),
          authMeta
        )
      )
    );
  }

  async deleteManyAndSync(ids: Primary<FunctionVariableEntity>[]) {
    return this.postgresEM.transactional(async () => {
      const functionVariables = await this.findMany(ids);

      await this.deleteMany(functionVariables);

      return {
        delete: { functionVariables },
      };
    });
  }

  async deleteManyAndBroadcast(authMeta: AuthMetaPayload, ids: Primary<FunctionVariableEntity>[]) {
    const result = await this.deleteManyAndSync(ids);

    await this.broadcastDeleteMany(authMeta, result);
  }
}
