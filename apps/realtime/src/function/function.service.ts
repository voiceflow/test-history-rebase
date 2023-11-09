/* eslint-disable no-await-in-loop */
/* eslint-disable max-params */
import { Primary } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import type { FunctionEntity, FunctionPathEntity, FunctionVariableEntity, ORMMutateOptions, PKOrEntity } from '@voiceflow/orm-designer';
import { AssistantORM, FolderORM, FunctionORM } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { EntitySerializer, TabularService } from '@/common';
import type { CreateOneForUserData } from '@/common/types';
import { broadcastContext, groupByAssistant, toEntityIDs } from '@/common/utils';

import { FunctionCreateData } from './function.interface';
import { FunctionPathService } from './function-path/function-path.service';
import { FunctionVariableService } from './function-variable/function-variable.service';

@Injectable()
export class FunctionService extends TabularService<FunctionORM> {
  constructor(
    @Inject(FunctionORM)
    protected readonly orm: FunctionORM,
    @Inject(FolderORM)
    protected readonly folderORM: FolderORM,
    @Inject(AssistantORM)
    protected readonly assistantORM: AssistantORM,
    @Inject(LoguxService)
    private readonly logux: LoguxService,
    @Inject(FunctionVariableService)
    private readonly functionVariable: FunctionVariableService,
    @Inject(FunctionPathService)
    private readonly functionPath: FunctionPathService,
    @Inject(EntitySerializer)
    private readonly entitySerializer: EntitySerializer
  ) {
    super();
  }

  /* Create */

  async createManyAndSync(userID: number, data: CreateOneForUserData<FunctionORM>[]) {
    const functionResources: FunctionEntity[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const { ...functionResourceData } of data) {
      const functionResource = await this.createOneForUser(userID, functionResourceData, { flush: false });

      functionResources.push(functionResource);
    }

    await this.orm.em.flush();

    return {
      add: { functionResources },
    };
  }

  async broadcastAddMany(
    authMeta: AuthMetaPayload,
    {
      add,
    }: {
      add: {
        functionResources: FunctionEntity[];
      };
    }
  ) {
    await Promise.all([
      ...groupByAssistant(add.functionResources).map((functionResources) =>
        this.logux.process(
          Actions.Function.AddMany({
            data: this.entitySerializer.iterable(functionResources),
            context: broadcastContext(functionResources[0]),
          }),
          authMeta
        )
      ),
    ]);
  }

  async createManyAndBroadcast(authMeta: AuthMetaPayload, data: FunctionCreateData[]) {
    const result = await this.createManyAndSync(authMeta.userID, data);

    await this.broadcastAddMany(authMeta, result);

    return result.add.functionResources;
  }

  /* Delete */

  async collectRelationsToDelete(functionResources: PKOrEntity<FunctionEntity>[]) {
    const [functionVariables, functionPaths] = await Promise.all([
      this.functionVariable.findManyByFunctions(functionResources),
      this.functionPath.findManyByFunctions(functionResources),
    ]);

    return {
      functionVariables,
      functionPaths,
    };
  }

  async deleteManyWithRelations(
    {
      functionResources,
      functionVariables,
      functionPaths,
    }: {
      functionResources: PKOrEntity<FunctionEntity>[];
      functionVariables: PKOrEntity<FunctionVariableEntity>[];
      functionPaths: PKOrEntity<FunctionPathEntity>[];
    },
    { flush = true }: ORMMutateOptions = {}
  ) {
    await Promise.all([
      this.functionVariable.deleteMany(functionVariables, { flush: false }),
      this.functionPath.deleteMany(functionPaths, { flush: false }),
      this.deleteMany(functionResources, { flush: false }),
    ]);

    if (flush) {
      await this.orm.em.flush();
    }
  }

  async deleteManyAndSync(ids: Primary<FunctionEntity>[]) {
    const functionResources = await this.findMany(ids);

    const relations = await this.collectRelationsToDelete(functionResources);

    await this.deleteManyWithRelations({ ...relations, functionResources }, { flush: false });

    await this.orm.em.flush();

    return {
      delete: { ...relations, functionResources },
    };
  }

  async broadcastDeleteMany(
    authMeta: AuthMetaPayload,
    {
      delete: del,
    }: {
      delete: {
        functionResources: FunctionEntity[];
        functionVariables: FunctionVariableEntity[];
        functionPaths: FunctionPathEntity[];
      };
    }
  ) {
    await Promise.all([
      this.functionVariable.broadcastDeleteMany(authMeta, {
        delete: Utils.object.pick(del, ['functionVariables']),
      }),

      this.functionPath.broadcastDeleteMany(authMeta, {
        delete: Utils.object.pick(del, ['functionPaths']),
      }),

      ...groupByAssistant(del.functionResources).map((functionResources) =>
        this.logux.process(
          Actions.Function.DeleteMany({
            ids: toEntityIDs(functionResources),
            context: broadcastContext(functionResources[0]),
          }),
          authMeta
        )
      ),
    ]);
  }

  async deleteManyAndBroadcast(authMeta: AuthMetaPayload, ids: Primary<FunctionEntity>[]): Promise<void> {
    const result = await this.deleteManyAndSync(ids);

    await this.broadcastDeleteMany(authMeta, result);
  }
}
