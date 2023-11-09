import { Primary } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import type { AssistantEntity, FunctionEntity, FunctionPathEntity, PKOrEntity } from '@voiceflow/orm-designer';
import { AssistantORM, FunctionPathORM } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { EntitySerializer, MutableService } from '@/common';
import type { CreateManyData } from '@/common/types';
import { broadcastContext, groupByAssistant, toEntityIDs } from '@/common/utils';

@Injectable()
export class FunctionPathService extends MutableService<FunctionPathORM> {
  constructor(
    @Inject(FunctionPathORM)
    protected readonly orm: FunctionPathORM,
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

  async createManyAndSync(data: CreateManyData<FunctionPathORM>) {
    const functionPaths = await this.createMany(data);

    return {
      add: { functionPaths },
    };
  }

  async broadcastAddMany(authMeta: AuthMetaPayload, { add }: { add: { functionPaths: FunctionPathEntity[] } }) {
    await Promise.all(
      groupByAssistant(add.functionPaths).map((functionPaths) =>
        this.logux.process(
          Actions.FunctionPath.AddMany({
            data: this.entitySerializer.iterable(functionPaths),
            context: broadcastContext(functionPaths[0]),
          }),
          authMeta
        )
      )
    );
  }

  async createManyAndBroadcast(authMeta: AuthMetaPayload, data: CreateManyData<FunctionPathORM>) {
    const result = await this.createManyAndSync(data);

    await this.broadcastAddMany(authMeta, result);

    return result.add.functionPaths;
  }

  /* Delete */

  async broadcastDeleteMany(authMeta: AuthMetaPayload, { delete: del }: { delete: { functionPaths: FunctionPathEntity[] } }) {
    await Promise.all(
      groupByAssistant(del.functionPaths).map((functionPaths) =>
        this.logux.process(
          Actions.FunctionPath.DeleteMany({
            ids: toEntityIDs(functionPaths),
            context: broadcastContext(functionPaths[0]),
          }),
          authMeta
        )
      )
    );
  }

  async deleteManyAndSync(ids: Primary<FunctionPathEntity>[]) {
    const functionPaths = await this.findMany(ids);

    await this.deleteMany(functionPaths);

    return {
      delete: { functionPaths },
    };
  }

  async deleteManyAndBroadcast(authMeta: AuthMetaPayload, ids: Primary<FunctionPathEntity>[]) {
    const result = await this.deleteManyAndSync(ids);

    await this.broadcastDeleteMany(authMeta, result);
  }
}
