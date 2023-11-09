import { Primary } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import type { AssistantEntity, FunctionEntity, FunctionVariableEntity, PKOrEntity } from '@voiceflow/orm-designer';
import { AssistantORM, FunctionVariableORM } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { EntitySerializer, MutableService } from '@/common';
import type { CreateManyData } from '@/common/types';
import { broadcastContext, groupByAssistant, toEntityIDs } from '@/common/utils';

@Injectable()
export class FunctionVariableService extends MutableService<FunctionVariableORM> {
  constructor(
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

  findManyByAssistant(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.orm.findManyByAssistant(assistant, environmentID);
  }

  /* Create */

  async createManyAndSync(data: CreateManyData<FunctionVariableORM>) {
    const functionVariables = await this.createMany(data);

    return {
      add: { functionVariables },
    };
  }

  async broadcastAddMany(authMeta: AuthMetaPayload, { add }: { add: { functionVariables: FunctionVariableEntity[] } }) {
    await Promise.all(
      groupByAssistant(add.functionVariables).map((functionVariables) =>
        this.logux.process(
          Actions.FunctionVariable.AddMany({
            data: this.entitySerializer.iterable(functionVariables),
            context: broadcastContext(functionVariables[0]),
          }),
          authMeta
        )
      )
    );
  }

  async createManyAndBroadcast(authMeta: AuthMetaPayload, data: CreateManyData<FunctionVariableORM>) {
    const result = await this.createManyAndSync(data);

    await this.broadcastAddMany(authMeta, result);

    return result.add.functionVariables;
  }

  /* Delete */

  async broadcastDeleteMany(authMeta: AuthMetaPayload, { delete: del }: { delete: { functionVariables: FunctionVariableEntity[] } }) {
    await Promise.all(
      groupByAssistant(del.functionVariables).map((functionVariables) =>
        this.logux.process(
          Actions.FunctionVariable.DeleteMany({
            ids: toEntityIDs(functionVariables),
            context: broadcastContext(functionVariables[0]),
          }),
          authMeta
        )
      )
    );
  }

  async deleteManyAndSync(ids: Primary<FunctionVariableEntity>[]) {
    const functionVariables = await this.findMany(ids);

    await this.deleteMany(functionVariables);

    return {
      delete: { functionVariables },
    };
  }

  async deleteManyAndBroadcast(authMeta: AuthMetaPayload, ids: Primary<FunctionVariableEntity>[]) {
    const result = await this.deleteManyAndSync(ids);

    await this.broadcastDeleteMany(authMeta, result);
  }
}
