import { Primary } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import type { AssistantEntity, FunctionEntity, FunctionPathEntity, PKOrEntity } from '@voiceflow/orm-designer';
import { AssistantORM, FunctionPathORM } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { CMSObjectService, EntitySerializer } from '@/common';
import type { CreateManyForUserData } from '@/common/types';
import { assistantBroadcastContext, groupByAssistant, toEntityIDs } from '@/common/utils';

@Injectable()
export class FunctionPathService extends CMSObjectService<FunctionPathORM> {
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

  async createManyAndSync(userID: number, data: CreateManyForUserData<FunctionPathORM>) {
    const functionPaths = await this.createManyForUser(userID, data);

    return {
      add: { functionPaths },
    };
  }

  async broadcastAddMany(authMeta: AuthMetaPayload, { add }: { add: { functionPaths: FunctionPathEntity[] } }) {
    await Promise.all(
      groupByAssistant(add.functionPaths).map((functionPaths) =>
        this.logux.processAs(
          Actions.FunctionPath.AddMany({
            data: this.entitySerializer.iterable(functionPaths),
            context: assistantBroadcastContext(functionPaths[0]),
          }),
          authMeta
        )
      )
    );
  }

  async createManyAndBroadcast(authMeta: AuthMetaPayload, data: CreateManyForUserData<FunctionPathORM>) {
    const result = await this.createManyAndSync(authMeta.userID, data);

    await this.broadcastAddMany(authMeta, result);

    return result.add.functionPaths;
  }

  /* Delete */

  async broadcastDeleteMany(authMeta: AuthMetaPayload, { delete: del }: { delete: { functionPaths: FunctionPathEntity[] } }) {
    await Promise.all(
      groupByAssistant(del.functionPaths).map((functionPaths) =>
        this.logux.processAs(
          Actions.FunctionPath.DeleteMany({
            ids: toEntityIDs(functionPaths),
            context: assistantBroadcastContext(functionPaths[0]),
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
