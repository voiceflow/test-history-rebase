/* eslint-disable max-params */
/* eslint-disable no-await-in-loop */

import { Primary } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import type {
  FunctionEntity,
  FunctionPathEntity,
  FunctionVariableEntity,
  ORMMutateOptions,
  PKOrEntity,
  ToJSONWithForeignKeys,
} from '@voiceflow/orm-designer';
import { FunctionORM, VersionORM } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { EntitySerializer, TabularService } from '@/common';
import type { CreateOneForUserData } from '@/common/types';
import { assistantBroadcastContext, groupByAssistant, toEntityIDs } from '@/common/utils';
import { deepSetCreatorID } from '@/utils/creator.util';
import { cloneManyEntities } from '@/utils/entity.util';

import { FunctionExportImportDataDTO } from './dtos/function-export-import-data.dto';
import { FunctionCreateData } from './function.interface';
import { FunctionPathService } from './function-path/function-path.service';
import { FunctionVariableService } from './function-variable/function-variable.service';

@Injectable()
export class FunctionService extends TabularService<FunctionORM> {
  constructor(
    @Inject(FunctionORM)
    protected readonly orm: FunctionORM,
    @Inject(VersionORM)
    protected readonly versionORM: VersionORM,
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

  /* Export */

  prepareExportData({
    functions,
    functionPaths,
    functionVariables,
  }: {
    functions: FunctionEntity[];
    functionPaths: FunctionPathEntity[];
    functionVariables: FunctionVariableEntity[];
  }) {
    return {
      functions: this.entitySerializer.iterable(functions),
      functionPaths: this.entitySerializer.iterable(functionPaths),
      functionVariables: this.entitySerializer.iterable(functionVariables),
    };
  }

  async exportJSON(environmentID: string, functionIDs?: string[]) {
    let functions: FunctionEntity[];
    let functionPaths: FunctionPathEntity[];
    let functionVariables: FunctionVariableEntity[];

    if (!functionIDs?.length) {
      const version = await this.versionORM.findOneOrFail(environmentID);

      ({ functions, functionPaths, functionVariables } = await this.findManyWithSubResourcesByAssistant(version.projectID.toJSON(), environmentID));
    } else {
      functions = await this.findMany(functionIDs.map((id) => ({ id, environmentID })));

      [functionPaths, functionVariables] = await Promise.all([
        this.functionPath.findManyByFunctions(functions),
        this.functionVariable.findManyByFunctions(functions),
      ]);
    }

    return this.prepareExportData({ functions, functionPaths, functionVariables });
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
    const [{ functions: sourceFunctions, functionPaths: sourceFunctionPaths, functionVariables: sourceFunctionVariables }, targetFunctions] =
      await Promise.all([
        this.findManyWithSubResourcesByAssistant(assistantID, sourceEnvironmentID),
        this.findManyByAssistant(assistantID, targetEnvironmentID),
      ]);

    await this.deleteMany(targetFunctions, { flush: false });

    const result = this.importManyWithSubResources(
      {
        functions: cloneManyEntities(sourceFunctions, { environmentID: targetEnvironmentID }),
        functionPaths: cloneManyEntities(sourceFunctionPaths, { environmentID: targetEnvironmentID }),
        functionVariables: cloneManyEntities(sourceFunctionVariables, { environmentID: targetEnvironmentID }),
      },
      { flush: false }
    );

    if (flush) {
      await this.orm.em.flush();
    }

    return result;
  }

  /* Import */

  prepareImportData(
    { functions, functionPaths, functionVariables }: FunctionExportImportDataDTO,
    { userID, backup, assistantID, environmentID }: { userID: number; backup?: boolean; assistantID: string; environmentID: string }
  ) {
    const createdAt = new Date().toJSON();

    return {
      functions: functions.map<ToJSONWithForeignKeys<FunctionEntity>>((item) =>
        backup
          ? { ...item, assistantID, environmentID }
          : { ...deepSetCreatorID(item, userID), createdAt, updatedAt: createdAt, assistantID, environmentID }
      ),

      functionPaths: functionPaths.map<ToJSONWithForeignKeys<FunctionPathEntity>>((item) =>
        backup
          ? { ...item, assistantID, environmentID }
          : { ...deepSetCreatorID(item, userID), createdAt, updatedAt: createdAt, assistantID, environmentID }
      ),

      functionVariables: functionVariables.map<ToJSONWithForeignKeys<FunctionVariableEntity>>((item) =>
        backup
          ? { ...item, assistantID, environmentID }
          : { ...deepSetCreatorID(item, userID), createdAt, updatedAt: createdAt, assistantID, environmentID }
      ),
    };
  }

  async importManyWithSubResources(
    data: {
      functions: ToJSONWithForeignKeys<FunctionEntity>[];
      functionPaths: ToJSONWithForeignKeys<FunctionPathEntity>[];
      functionVariables: ToJSONWithForeignKeys<FunctionVariableEntity>[];
    },
    { flush = true }: ORMMutateOptions = {}
  ) {
    const [functions, functionPaths, functionVariables] = await Promise.all([
      this.createMany(data.functions, { flush: false }),
      this.functionPath.createMany(data.functionPaths, { flush: false }),
      this.functionVariable.createMany(data.functionVariables, { flush: false }),
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

  async importJSONAndBroadcast({
    data,
    userID,
    clientID,
    environmentID,
  }: {
    data: FunctionExportImportDataDTO;
    userID: number;
    clientID?: string;
    environmentID: string;
  }) {
    const version = await this.versionORM.findOneOrFail(environmentID);

    const importData = this.prepareImportData(data, { userID, assistantID: version.projectID.toJSON(), environmentID });

    const result = await this.orm.em.transactional(() => this.importManyWithSubResources(importData));

    if (!clientID) {
      return result.functions;
    }

    await this.broadcastAddMany({ userID, clientID }, { add: result });

    return result.functions;
  }

  /* Create */

  async createManyAndSync(userID: number, data: CreateOneForUserData<FunctionORM>[]) {
    const functions: FunctionEntity[] = [];

    for (const { ...functionResourceData } of data) {
      const functionResource = await this.createOneForUser(userID, functionResourceData, { flush: false });

      functions.push(functionResource);
    }

    await this.orm.em.flush();

    return {
      add: { functions, functionPaths: [], functionVariables: [] },
    };
  }

  async broadcastAddMany(
    authMeta: AuthMetaPayload,
    {
      add,
    }: {
      add: {
        functions: FunctionEntity[];
        functionPaths: FunctionPathEntity[];
        functionVariables: FunctionVariableEntity[];
      };
    }
  ) {
    await Promise.all([
      this.functionPath.broadcastAddMany(authMeta, { add: Utils.object.pick(add, ['functionPaths']) }),
      this.functionVariable.broadcastAddMany(authMeta, { add: Utils.object.pick(add, ['functionVariables']) }),

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
