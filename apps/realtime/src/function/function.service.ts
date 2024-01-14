/* eslint-disable max-params */
/* eslint-disable no-await-in-loop */

import { Primary } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { Function as FunctionType, FunctionPath, FunctionVariable } from '@voiceflow/dtos';
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

import { CMSTabularService, EntitySerializer } from '@/common';
import type { CreateOneForUserData } from '@/common/types';
import { assistantBroadcastContext, groupByAssistant, toEntityIDs } from '@/common/utils';
import { deepSetCreatorID } from '@/utils/creator.util';
import { cloneManyEntities } from '@/utils/entity.util';

import { FunctionExportImportDataDTO } from './dtos/function-export-import-data.dto';
import { FunctionCreateData } from './function.interface';
import { FunctionPathService } from './function-path/function-path.service';
import { FunctionVariableService } from './function-variable/function-variable.service';

@Injectable()
export class FunctionService extends CMSTabularService<FunctionORM> {
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

  async findManyWithSubResourcesByEnvironment(assistantID: string, environmentID: string) {
    const [functions, functionPaths, functionVariables] = await Promise.all([
      this.findManyByEnvironment(assistantID, environmentID),
      this.functionPath.findManyByEnvironment(assistantID, environmentID),
      this.functionVariable.findManyByEnvironment(assistantID, environmentID),
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

      ({ functions, functionPaths, functionVariables } = await this.findManyWithSubResourcesByEnvironment(version.projectID.toJSON(), environmentID));
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
      sourceAssistantID,
      targetAssistantID,
      sourceEnvironmentID,
      targetEnvironmentID,
    }: {
      sourceAssistantID: string;
      targetAssistantID: string;
      sourceEnvironmentID: string;
      targetEnvironmentID: string;
    },
    { flush = true }: ORMMutateOptions = {}
  ) {
    const {
      functions: sourceFunctions,
      functionPaths: sourceFunctionPaths,
      functionVariables: sourceFunctionVariables,
    } = await this.findManyWithSubResourcesByEnvironment(sourceAssistantID, sourceEnvironmentID);

    const result = this.importManyWithSubResources(
      {
        functions: cloneManyEntities(sourceFunctions, { assistantID: targetAssistantID, environmentID: targetEnvironmentID }),
        functionPaths: cloneManyEntities(sourceFunctionPaths, { assistantID: targetAssistantID, environmentID: targetEnvironmentID }),
        functionVariables: cloneManyEntities(sourceFunctionVariables, { assistantID: targetAssistantID, environmentID: targetEnvironmentID }),
      },
      { flush: false }
    );

    if (flush) {
      await this.orm.em.flush();
    }

    return result;
  }

  /* Import */

  async filterImportData({ functions, functionPaths, functionVariables }: FunctionExportImportDataDTO, { environmentID }: { environmentID: string }) {
    const currentFunctions = await this.findMany(functions.map(({ id }) => ({ id, environmentID })));
    const existingFunctions = functions.filter((item) => item.id && currentFunctions.find(({ id }) => id === item.id));

    return {
      functions: functions.filter((item) => item.id && !currentFunctions.find(({ id }) => id === item.id)),
      functionPaths: functionPaths.filter((item) => item.functionID && !existingFunctions.find(({ id }) => id === item.functionID)),
      functionVariables: functionVariables.filter((item) => item.functionID && !existingFunctions.find(({ id }) => id === item.functionID)),
      duplicatedFunctions: existingFunctions,
    };
  }

  prepareImportData(
    { functions, functionPaths, functionVariables }: FunctionExportImportDataDTO,
    { userID, backup, assistantID, environmentID }: { userID: number; backup?: boolean; assistantID: string; environmentID: string }
  ) {
    const createdAt = new Date();

    const byCreatedAt = (itemA: { createdAt: string }, itemB: { createdAt: string }) =>
      new Date(itemA.createdAt).getTime() - new Date(itemB.createdAt).getTime();

    functionPaths.sort(byCreatedAt);
    functionVariables.sort(byCreatedAt);

    const staggerDate = (date: Date, delta: number): string => new Date(date.getTime() + delta).toJSON();

    return {
      functions: functions.map<ToJSONWithForeignKeys<FunctionEntity>>((item) =>
        backup
          ? { ...item, assistantID, environmentID }
          : { ...deepSetCreatorID(item, userID), createdAt: createdAt.toJSON(), updatedAt: createdAt.toJSON(), assistantID, environmentID }
      ),

      functionPaths: functionPaths.map<ToJSONWithForeignKeys<FunctionPathEntity>>((item, idx) =>
        backup
          ? { ...item, assistantID, environmentID }
          : {
              ...deepSetCreatorID(item, userID),
              createdAt: staggerDate(createdAt, idx),
              updatedAt: createdAt.toJSON(),
              assistantID,
              environmentID,
            }
      ),

      functionVariables: functionVariables.map<ToJSONWithForeignKeys<FunctionVariableEntity>>((item, idx) =>
        backup
          ? { ...item, assistantID, environmentID }
          : {
              ...deepSetCreatorID(item, userID),
              createdAt: staggerDate(createdAt, idx),
              updatedAt: createdAt.toJSON(),
              assistantID,
              environmentID,
            }
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

  async duplicateOneAndBroadcast(
    authMeta: AuthMetaPayload,
    { functionID, assistantID, userID }: { functionID: Primary<FunctionEntity>; assistantID: string; userID: number }
  ) {
    const duplicateFunctionResource = await this.findOneOrFail(functionID);
    const duplicateFunctionVariables = await this.functionVariable.findManyByFunctions([duplicateFunctionResource]);
    const duplicateFunctionPaths = await this.functionPath.findManyByFunctions([duplicateFunctionResource]);

    const { functionResource, functionPaths, functionVariables } = await this.orm.em.transactional(async (em) => {
      const resource = await this.createOneForUser(authMeta.userID, {
        assistantID,
        environmentID: duplicateFunctionResource.environmentID,
        name: `${duplicateFunctionResource.name} (copy)`,
        code: duplicateFunctionResource.code,
        image: duplicateFunctionResource.image,
        folderID: duplicateFunctionResource.folder?.id ?? null,
        description: duplicateFunctionResource.description,
      });

      const variables = await this.functionVariable.createManyForUser(
        userID,
        duplicateFunctionVariables.map((v) => ({
          assistantID,
          environmentID: v.environmentID,
          functionID: resource.id,
          name: v.name,
          value: v.function,
          description: v.description,
          type: v.type,
        })),
        { flush: false }
      );

      const paths = await this.functionPath.createManyForUser(
        userID,
        duplicateFunctionPaths.map((p) => ({
          assistantID,
          environmentID: p.environmentID,
          functionID: resource.id,
          label: p.label,
          name: p.name,
        })),
        { flush: false }
      );

      await em.flush();

      return {
        functionResource: resource,
        functionVariables: variables,
        functionPaths: paths,
      };
    });

    await this.broadcastAddMany(authMeta, {
      add: {
        functions: [functionResource],
        functionVariables,
        functionPaths,
      },
    });

    return { functionResource, functionPaths, functionVariables };
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
    const { duplicatedFunctions, ...functionsToImport } = await this.filterImportData(data, { environmentID });

    const importData = this.prepareImportData(functionsToImport, { userID, assistantID: version.projectID.toJSON(), environmentID });

    const result = await this.orm.em.transactional(() => this.importManyWithSubResources(importData));

    if (!clientID) {
      return { duplicatedFunctions, functions: result.functions };
    }

    await this.broadcastAddMany({ userID, clientID }, { add: result });

    return { duplicatedFunctions, functions: result.functions };
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

    await this.deleteMany(functions, { flush: false });

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

  /* Upsert */

  async upsertManyWithSubResources({
    functions,
    functionPaths,
    functionVariables,
  }: {
    functions: FunctionType[];
    functionPaths: FunctionPath[];
    functionVariables: FunctionVariable[];
  }) {
    await this.upsertMany(functions);
    await this.functionPath.upsertMany(functionPaths);
    await this.functionVariable.upsertMany(functionVariables);
  }
}
