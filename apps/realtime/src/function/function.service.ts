/* eslint-disable max-params */

import { EntityManager } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import {
  Function as FunctionType,
  FunctionPath,
  FunctionVariable,
  Reference,
  ReferenceResource,
} from '@voiceflow/dtos';
import { LoguxService } from '@voiceflow/nestjs-logux';
import type {
  FunctionJSON,
  FunctionObject,
  FunctionPathJSON,
  FunctionPathObject,
  FunctionVariableJSON,
  FunctionVariableObject,
} from '@voiceflow/orm-designer';
import { DatabaseTarget, FunctionORM, ObjectId, VersionORM } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';
import fs from 'fs/promises';
import _ from 'lodash';

import { CMSTabularService } from '@/common';
import type { CMSCreateForUserData } from '@/common/types';
import { cmsBroadcastContext, injectAssistantAndEnvironmentIDs, toPostgresEntityIDs } from '@/common/utils';
import { ReferenceService } from '@/reference/reference.service';
import { CMSBroadcastMeta, CMSContext } from '@/types';

import type { FunctionExportDataDTO } from './dtos/function-export-data.dto';
import type { FunctionImportDataDTO, FunctionImportDTO } from './dtos/function-import-data.dto';
import { FunctionImportDataDTO as FunctionImportData } from './dtos/function-import-data.dto';
import { FunctionPathService } from './function-path/function-path.service';
import { FunctionVariableService } from './function-variable/function-variable.service';

@Injectable()
export class FunctionService extends CMSTabularService<FunctionORM> {
  toJSON = this.orm.jsonAdapter.fromDB;

  fromJSON = this.orm.jsonAdapter.toDB;

  mapToJSON = this.orm.jsonAdapter.mapFromDB;

  mapFromJSON = this.orm.jsonAdapter.mapToDB;

  constructor(
    @Inject(FunctionORM)
    protected readonly orm: FunctionORM,
    @Inject(VersionORM)
    protected readonly versionORM: VersionORM,
    @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
    private readonly postgresEM: EntityManager,
    @Inject(LoguxService)
    private readonly logux: LoguxService,
    @Inject(ReferenceService)
    private readonly reference: ReferenceService,
    @Inject(FunctionPathService)
    private readonly functionPath: FunctionPathService,
    @Inject(FunctionVariableService)
    private readonly functionVariable: FunctionVariableService
  ) {
    super();
  }

  /* Find */

  async findManyWithSubResourcesByEnvironment(environmentID: string) {
    const [functions, functionPaths, functionVariables] = await Promise.all([
      this.findManyByEnvironment(environmentID),
      this.functionPath.findManyByEnvironment(environmentID),
      this.functionVariable.findManyByEnvironment(environmentID),
    ]);

    return {
      functions,
      functionPaths,
      functionVariables,
    };
  }

  /* Export */

  toJSONWithSubResources({
    functions,
    functionPaths,
    functionVariables,
  }: {
    functions: FunctionObject[];
    functionPaths: FunctionPathObject[];
    functionVariables: FunctionVariableObject[];
  }) {
    return {
      functions: this.mapToJSON(functions),
      functionPaths: this.functionPath.mapToJSON(functionPaths),
      functionVariables: this.functionVariable.mapToJSON(functionVariables),
    };
  }

  fromJSONWithSubResources({ functions, functionPaths, functionVariables }: FunctionImportDataDTO) {
    return {
      functions: this.mapFromJSON(functions),
      functionPaths: this.functionPath.mapFromJSON(functionPaths),
      functionVariables: this.functionVariable.mapFromJSON(functionVariables),
    };
  }

  prepareExportData(
    data: {
      functions: FunctionObject[];
      functionPaths: FunctionPathObject[];
      functionVariables: FunctionVariableObject[];
    },
    { backup }: { backup?: boolean } = {}
  ): FunctionExportDataDTO {
    const json = this.toJSONWithSubResources(data);

    if (backup) {
      return json;
    }

    return {
      functions: json.functions.map((item) => Utils.object.omit(item, ['assistantID', 'environmentID'])),
      functionPaths: json.functionPaths.map((item) =>
        Utils.object.omit(item, ['updatedAt', 'updatedByID', 'assistantID', 'environmentID'])
      ),
      functionVariables: json.functionVariables.map((item) =>
        Utils.object.omit(item, ['updatedAt', 'updatedByID', 'assistantID', 'environmentID'])
      ),
    };
  }

  async exportJSON(environmentID: string, functionIDs?: string[]) {
    if (!functionIDs?.length) {
      const result = await this.findManyWithSubResourcesByEnvironment(environmentID);

      return this.prepareExportData(result);
    }

    const [functions, functionPaths, functionVariables] = await Promise.all([
      this.findManyByEnvironmentAndIDs(environmentID, functionIDs),
      this.functionPath.findManyByFunctions(environmentID, functionIDs),
      this.functionVariable.findManyByFunctions(environmentID, functionIDs),
    ]);

    return this.prepareExportData({ functions, functionPaths, functionVariables });
  }

  /* Clone */

  async cloneManyWithSubResourcesForEnvironment({
    targetAssistantID,
    sourceEnvironmentID,
    targetEnvironmentID,
  }: {
    targetAssistantID: string;
    sourceEnvironmentID: string;
    targetEnvironmentID: string;
  }) {
    const {
      functions: sourceFunctions,
      functionPaths: sourceFunctionPaths,
      functionVariables: sourceFunctionVariables,
    } = await this.findManyWithSubResourcesByEnvironment(sourceEnvironmentID);

    return this.importManyWithSubResources({
      functions: sourceFunctions.map((item) => ({
        ...item,
        assistantID: targetAssistantID,
        environmentID: targetEnvironmentID,
      })),
      functionPaths: sourceFunctionPaths.map((item) => ({
        ...item,
        assistantID: targetAssistantID,
        environmentID: targetEnvironmentID,
      })),
      functionVariables: sourceFunctionVariables.map((item) => ({
        ...item,
        assistantID: targetAssistantID,
        environmentID: targetEnvironmentID,
      })),
    });
  }

  /* Import */

  async filterImportData(
    environmentID: string,
    { functions, functionPaths, functionVariables }: FunctionImportDataDTO
  ) {
    const currentFunctions = await this.findManyByEnvironmentAndIDs(environmentID, toPostgresEntityIDs(functions));
    const existingFunctions = functions
      .filter((item) => item.id && currentFunctions.find(({ id }) => id === item.id))
      .map((f) => ({ ...f, pathOrder: f.pathOrder ?? [] }));

    return {
      functions: functions.filter((item) => item.id && !currentFunctions.find(({ id }) => id === item.id)),
      functionPaths: functionPaths.filter(
        (item) => item.functionID && !existingFunctions.find(({ id }) => id === item.functionID)
      ),
      functionVariables: functionVariables.filter(
        (item) => item.functionID && !existingFunctions.find(({ id }) => id === item.functionID)
      ),
      duplicatedFunctions: existingFunctions,
    };
  }

  prepareImportData(
    { functions, functionPaths, functionVariables }: FunctionImportDataDTO,
    {
      userID,
      backup,
      assistantID,
      environmentID,
    }: { userID: number; backup?: boolean; assistantID: string; environmentID: string }
  ): {
    functions: FunctionJSON[];
    functionPaths: FunctionPathJSON[];
    functionVariables: FunctionVariableJSON[];
  } {
    const createdAt = new Date().toJSON();
    const sortByCreatedAt = (itemA: { createdAt: string }, itemB: { createdAt: string }) =>
      new Date(itemA.createdAt).getTime() - new Date(itemB.createdAt).getTime();

    const orderedFunctionPaths = [...functionPaths].sort(sortByCreatedAt);
    const functionPathsByFunction = _.groupBy(orderedFunctionPaths, (item) => item.functionID);
    const getPathOrder = (func: FunctionImportDTO) =>
      func.pathOrder ? func.pathOrder : functionPathsByFunction[func.id]?.map((path) => path.id) ?? [];

    if (backup) {
      return {
        functions: functions.map((item) => ({
          ...item,
          pathOrder: getPathOrder(item),
          assistantID,
          environmentID,
        })),

        functionPaths: functionPaths.map((item) => ({
          ...item,
          updatedAt: item.updatedAt ?? createdAt,
          updatedByID: item.updatedByID ?? userID,
          assistantID,
          environmentID,
        })),

        functionVariables: functionVariables.map((item) => ({
          ...item,
          updatedAt: item.updatedAt ?? createdAt,
          updatedByID: item.updatedByID ?? userID,
          assistantID,
          environmentID,
        })),
      };
    }

    const staggerDate = (date: Date, delta: number): string => new Date(date.getTime() + delta).toJSON();

    return {
      functions: functions.map((item) => ({
        ...item,
        pathOrder: getPathOrder(item),
        createdAt,
        updatedAt: createdAt,
        createdByID: userID,
        updatedByID: userID,
        assistantID,
        environmentID,
      })),

      functionPaths: [...functionPaths].sort(sortByCreatedAt).map((item, index) => ({
        ...item,
        createdAt: staggerDate(new Date(createdAt), index),
        updatedAt: createdAt,
        assistantID,
        updatedByID: userID,
        environmentID,
      })),

      functionVariables: [...functionVariables].sort(sortByCreatedAt).map((item, index) => ({
        ...item,
        createdAt: staggerDate(new Date(createdAt), index),
        updatedAt: createdAt,
        assistantID,
        updatedByID: userID,
        environmentID,
      })),
    };
  }

  async importManyWithSubResources(data: {
    functions: FunctionObject[];
    functionPaths: FunctionPathObject[];
    functionVariables: FunctionVariableObject[];
  }) {
    const functions = await this.createMany(data.functions);

    const [functionPaths, functionVariables] = await Promise.all([
      this.functionPath.createMany(data.functionPaths),
      this.functionVariable.createMany(data.functionVariables),
    ]);

    return {
      functions,
      functionPaths,
      functionVariables,
    };
  }

  async importManyWithSubResourcesFromJSON({ functions, functionPaths, functionVariables }: FunctionImportDataDTO) {
    await this.importManyWithSubResources(
      this.fromJSONWithSubResources({
        functions,
        functionPaths: functionPaths ?? [],
        functionVariables: functionVariables ?? [],
      })
    );
  }

  importJSONAndSync(data: FunctionImportDataDTO, { userID, context }: { userID: number; context: CMSContext }) {
    return this.postgresEM.transactional(async () => {
      const { duplicatedFunctions, ...dataToImport } = await this.filterImportData(context.environmentID, data);

      const { functions, functionPaths, functionVariables } = this.prepareImportData(dataToImport, {
        userID,
        assistantID: context.assistantID,
        environmentID: context.environmentID,
      });

      const result = await this.importManyWithSubResources({
        functions: this.mapFromJSON(functions).map((f) => ({ ...f, folderID: null })),
        functionPaths: this.functionPath.mapFromJSON(functionPaths),
        functionVariables: this.functionVariable.mapFromJSON(functionVariables),
      });

      return {
        add: result,
        duplicate: { functions: duplicatedFunctions },
      };
    });
  }

  async createOneFromTemplateAndBroadcast({
    data,
    userID,
    clientID,
    environmentID,
  }: {
    data: { templateID: string; name: string; description: string };
    userID: number;
    clientID: string;
    environmentID: string;
  }): Promise<FunctionObject> {
    const { templateID, name, description } = data;
    const rawTemplate = JSON.parse(
      (await fs.readFile(`./src/function/templates/${templateID}.function-template.json`)).toString()
    );

    const { functions, functionVariables, functionPaths } = FunctionImportData.parse(rawTemplate);

    const functionID = new ObjectId().toString();

    const functionPathsToCreate = functionPaths.map((path) => ({ ...path, id: new ObjectId().toString(), functionID }));

    const functionPathIdsRemap = Object.fromEntries(
      functionPaths.map((path, i) => [path.id, functionPathsToCreate[i].id])
    );

    const importData: FunctionImportDataDTO = {
      functions: [
        {
          ...functions[0],
          id: functionID,
          name,
          description,
          pathOrder:
            functions[0].pathOrder?.map((pathId) => functionPathIdsRemap[pathId]) ??
            functionPathsToCreate.map((p) => p.id),
        },
      ],
      functionVariables: functionVariables.map((variable) => ({
        ...variable,
        id: new ObjectId().toString(),
        functionID,
      })),
      functionPaths: functionPaths.map((path) => ({
        ...path,
        id: functionPathIdsRemap[path.id],
        functionID,
      })),
    };

    const { functions: createdFunctions } = await this.importJSONAndBroadcast(importData, {
      userID,
      clientID,
      environmentID,
    });

    if (createdFunctions.length === 0) {
      throw new Error('Realtime was unable to send back function created from template.');
    }

    return createdFunctions[0]!;
  }

  async importJSONAndBroadcast(
    data: FunctionImportDataDTO,
    { userID, clientID, environmentID }: { userID: number; clientID?: string; environmentID: string }
  ) {
    const assistantID = await this.versionORM.findOneOrFailProjectID(environmentID);

    const result = await this.importJSONAndSync(data, {
      userID,
      context: { assistantID: assistantID.toJSON(), environmentID },
    });

    if (clientID) {
      await this.broadcastAddMany(result, {
        auth: { userID, clientID },
        context: { assistantID: assistantID.toJSON(), environmentID },
      });
    }

    return { functions: result.add.functions, duplicatedFunctions: result.duplicate.functions };
  }

  /* Duplicate */

  duplicateManyAndSync(functionIDs: string[], { userID, context }: { userID: number; context: CMSContext }) {
    return this.postgresEM.transactional(async () => {
      const [sourceFunctions, sourceFunctionPaths, sourceFunctionVariables] = await Promise.all([
        this.findManyByEnvironmentAndIDs(context.environmentID, functionIDs),
        this.functionPath.findManyByFunctions(context.environmentID, functionIDs),
        this.functionVariable.findManyByFunctions(context.environmentID, functionIDs),
      ]);

      const sourceFunctionPathsByFunctionID = _.groupBy(sourceFunctionPaths, (item) => item.functionID);
      const sourceFunctionVariablesByFunctionID = _.groupBy(sourceFunctionVariables, (item) => item.functionID);

      const functions = await this.createManyForUser(
        userID,
        sourceFunctions.map((item) => ({
          ...Utils.object.omit(item, ['id', 'createdAt', 'updatedAt', 'createdByID', 'updatedByID']),
          name: `${item.name} (copy)`,
          assistantID: context.assistantID,
          environmentID: context.environmentID,
        }))
      );

      const functionPathsData = functions.flatMap(
        (item, index) =>
          sourceFunctionPathsByFunctionID[sourceFunctions[index].id]?.map((path) => ({
            ...Utils.object.omit(path, ['id', 'createdAt', 'updatedAt', 'updatedByID']),
            functionID: item.id,
            assistantID: context.assistantID,
            environmentID: context.environmentID,
          })) ?? []
      );

      const functionVariablesData = functions.flatMap(
        (item, index) =>
          sourceFunctionVariablesByFunctionID[sourceFunctions[index].id]?.map((path) => ({
            ...Utils.object.omit(path, ['id', 'createdAt', 'updatedAt', 'updatedByID']),
            functionID: item.id,
            assistantID: context.assistantID,
            environmentID: context.environmentID,
          })) ?? []
      );

      const [functionPaths, functionVariables] = await Promise.all([
        this.functionPath.createManyForUser(userID, functionPathsData),
        this.functionVariable.createManyForUser(userID, functionVariablesData),
      ]);

      return {
        add: {
          functions,
          functionPaths,
          functionVariables,
        },
      };
    });
  }

  async duplicateManyAndBroadcast(functionIDs: string[], meta: CMSBroadcastMeta) {
    const result = await this.duplicateManyAndSync(functionIDs, { userID: meta.auth.userID, context: meta.context });

    await this.broadcastAddMany(result, meta);

    return result.add.functions;
  }

  /* Create */

  async createManyAndSync(
    data: CMSCreateForUserData<FunctionORM>[],
    { userID, context }: { userID: number; context: CMSContext }
  ) {
    const functions = await this.createManyForUser(userID, data.map(injectAssistantAndEnvironmentIDs(context)));

    return {
      add: {
        functions,
        functionPaths: [],
        functionVariables: [],
      },
    };
  }

  async broadcastAddMany(
    {
      add,
    }: {
      add: {
        functions: FunctionObject[];
        functionPaths: FunctionPathObject[];
        functionVariables: FunctionVariableObject[];
      };
    },
    meta: CMSBroadcastMeta
  ) {
    await Promise.all([
      this.functionPath.broadcastAddMany(
        { add: Utils.object.pick(add, ['functionPaths']), sync: Utils.object.pick(add, ['functions']) },
        meta
      ),
      this.functionVariable.broadcastAddMany({ add: Utils.object.pick(add, ['functionVariables']) }, meta),
      this.logux.processAs(
        Actions.Function.AddMany({
          data: this.mapToJSON(add.functions),
          context: cmsBroadcastContext(meta.context),
        }),
        meta.auth
      ),
    ]);
  }

  async createManyAndBroadcast(data: CMSCreateForUserData<FunctionORM>[], meta: CMSBroadcastMeta) {
    const result = await this.createManyAndSync(data, { userID: meta.auth.userID, context: meta.context });

    await this.broadcastAddMany(result, meta);

    return result.add.functions;
  }

  /* Delete */

  async collectRelationsToDelete(environmentID: string, functionIDs: string[]) {
    const [functionPaths, functionVariables] = await Promise.all([
      this.functionPath.findManyByFunctions(environmentID, functionIDs),
      this.functionVariable.findManyByFunctions(environmentID, functionIDs),
    ]);

    return {
      functionPaths,
      functionVariables,
    };
  }

  async deleteManyAndSync(ids: string[], { userID, context }: { userID: number; context: CMSContext }) {
    return this.postgresEM.transactional(async () => {
      const [functions, relations] = await Promise.all([
        this.findManyByEnvironmentAndIDs(context.environmentID, ids),
        this.collectRelationsToDelete(context.environmentID, ids),
      ]);

      await this.deleteManyByEnvironmentAndIDs(context.environmentID, ids);

      const referenceRelations = await this.reference.deleteManyWithSubResourcesAndSyncByFunctionIDs({
        userID,
        functionIDs: ids,
        assistantID: context.assistantID,
        environmentID: context.environmentID,
      });

      return {
        ...referenceRelations,
        delete: { ...relations, ...referenceRelations.delete, functions },
      };
    });
  }

  async broadcastDeleteMany(
    {
      delete: del,
    }: {
      delete: {
        functions: FunctionObject[];
        references: Reference[];
        functionPaths: FunctionPathObject[];
        functionVariables: FunctionVariableObject[];
        referenceResources: ReferenceResource[];
      };
    },
    meta: CMSBroadcastMeta
  ) {
    await Promise.all([
      this.functionVariable.broadcastDeleteMany({ delete: Utils.object.pick(del, ['functionVariables']) }, meta),
      this.functionPath.broadcastDeleteMany(
        { delete: Utils.object.pick(del, ['functionPaths']), sync: Utils.object.pick(del, ['functions']) },
        meta
      ),

      this.reference.broadcastDeleteMany(
        { delete: Utils.object.pick(del, ['references', 'referenceResources']) },
        meta
      ),

      this.logux.processAs(
        Actions.Function.DeleteMany({
          ids: toPostgresEntityIDs(del.functions),
          context: cmsBroadcastContext(meta.context),
        }),
        meta.auth
      ),
    ]);
  }

  async deleteManyAndBroadcast(ids: string[], meta: CMSBroadcastMeta): Promise<void> {
    const result = await this.deleteManyAndSync(ids, { userID: meta.auth.userID, context: meta.context });

    await this.broadcastDeleteMany(result, meta);
  }

  /* Upsert */

  async upsertManyWithSubResources(
    data: { functions: FunctionType[]; functionPaths: FunctionPath[]; functionVariables: FunctionVariable[] },
    meta: { userID: number; assistantID: string; environmentID: string }
  ) {
    const { functions, functionPaths, functionVariables } = this.prepareImportData(data, meta);

    await this.upsertMany(this.mapFromJSON(functions));
    await this.functionPath.upsertMany(this.functionPath.mapFromJSON(functionPaths));
    await this.functionVariable.upsertMany(this.functionVariable.mapFromJSON(functionVariables));
  }
}
