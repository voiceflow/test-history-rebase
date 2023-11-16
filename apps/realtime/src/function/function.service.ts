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
import { assistantBroadcastContext, groupByAssistant, toEntityIDs } from '@/common/utils';
import { cloneManyEntities } from '@/utils/entity.util';

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
    @Inject(FunctionPathService)
    private readonly functionPath: FunctionPathService,
    @Inject(FunctionVariableService)
    private readonly functionVariable: FunctionVariableService,
    @Inject(EntitySerializer)
    private readonly entitySerializer: EntitySerializer
  ) {
    super();
  }

  /* Find */

  async findManyWithSubResourcesByAssistant(assistantID: string, environmentID: string) {
    const [functions, functionPaths, functionVariables] = await Promise.all([
      this.findManyByAssistant(assistantID, environmentID),
      this.functionPath.findManyByAssistant(assistantID, environmentID),
      this.functionVariable.findManyByAssistant(assistantID, environmentID),
    ]);

    return {
      functions,
      functionPaths,
      functionVariables,
    };
  }

  /* Clone */

  async cloneManyWithSubResourcesForEnvironment(
    {
      assistantID,
      sourceEnvironmentID,
      targetEnvironmentID,
    }: {
      assistantID: string;
      sourceEnvironmentID: string;
      targetEnvironmentID: string;
    },
    { flush = true }: ORMMutateOptions = {}
  ) {
    const [
      { functions: sourceFunctions, functionPaths: sourceFunctionPaths, functionVariables: sourceFunctionVariables },
      { functions: targetFunctions, functionPaths: targetFunctionPaths, functionVariables: targetFunctionVariables },
    ] = await Promise.all([
      this.findManyWithSubResourcesByAssistant(assistantID, sourceEnvironmentID),
      this.findManyWithSubResourcesByAssistant(assistantID, targetEnvironmentID),
    ]);

    await Promise.all([
      this.deleteMany(targetFunctions, { flush: false }),
      this.functionPath.deleteMany(targetFunctionPaths, { flush: false }),
      this.functionVariable.deleteMany(targetFunctionVariables, { flush: false }),
    ]);

    const [functions, functionPaths, functionVariables] = await Promise.all([
      this.createMany(cloneManyEntities(sourceFunctions, { environmentID: targetEnvironmentID }), { flush: false }),
      this.functionPath.createMany(cloneManyEntities(sourceFunctionPaths, { environmentID: targetEnvironmentID }), { flush: false }),
      this.functionVariable.createMany(cloneManyEntities(sourceFunctionVariables, { environmentID: targetEnvironmentID }), { flush: false }),
    ]);

    if (flush) {
      await this.orm.em.flush();
    }

    return {
      functions,
      functionPaths,
      functionVariables,
    };
  }

  /* Create */

  async createManyAndSync(userID: number, data: CreateOneForUserData<FunctionORM>[]) {
    const functions: FunctionEntity[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const { ...functionResourceData } of data) {
      const functionResource = await this.createOneForUser(userID, functionResourceData, { flush: false });

      functions.push(functionResource);
    }

    await this.orm.em.flush();

    return {
      add: { functions },
    };
  }

  async broadcastAddMany(
    authMeta: AuthMetaPayload,
    {
      add,
    }: {
      add: {
        functions: FunctionEntity[];
      };
    }
  ) {
    await Promise.all([
      ...groupByAssistant(add.functions).map((functions) =>
        this.logux.processAs(
          Actions.Function.AddMany({
            data: this.entitySerializer.iterable(functions),
            context: assistantBroadcastContext(functions[0]),
          }),
          authMeta
        )
      ),
    ]);
  }

  async createManyAndBroadcast(authMeta: AuthMetaPayload, data: FunctionCreateData[]) {
    const result = await this.createManyAndSync(authMeta.userID, data);

    await this.broadcastAddMany(authMeta, result);

    return result.add.functions;
  }

  /* Delete */

  async collectRelationsToDelete(functions: PKOrEntity<FunctionEntity>[]) {
    const [functionPaths, functionVariables] = await Promise.all([
      this.functionPath.findManyByFunctions(functions),
      this.functionVariable.findManyByFunctions(functions),
    ]);

    return {
      functionPaths,
      functionVariables,
    };
  }

  async deleteManyAndSync(ids: Primary<FunctionEntity>[]) {
    const functions = await this.findMany(ids);

    const relations = await this.collectRelationsToDelete(functions);

    await this.deleteMany(functions);

    await this.orm.em.flush();

    return {
      delete: { ...relations, functions },
    };
  }

  async broadcastDeleteMany(
    authMeta: AuthMetaPayload,
    {
      delete: del,
    }: {
      delete: {
        functions: FunctionEntity[];
        functionPaths: FunctionPathEntity[];
        functionVariables: FunctionVariableEntity[];
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

      ...groupByAssistant(del.functions).map((functions) =>
        this.logux.processAs(
          Actions.Function.DeleteMany({
            ids: toEntityIDs(functions),
            context: assistantBroadcastContext(functions[0]),
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
