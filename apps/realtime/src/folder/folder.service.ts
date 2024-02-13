/* eslint-disable max-params */
import type { EntityManager } from '@mikro-orm/core';
import { Primary } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { Folder } from '@voiceflow/dtos';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import type {
  AssistantEntity,
  EntityEntity,
  EntityVariantEntity,
  FolderEntity,
  FunctionEntity,
  FunctionPathEntity,
  FunctionVariableEntity,
  IntentEntity,
  ORMMutateOptions,
  PKOrEntity,
  RequiredEntityEntity,
  ToJSONWithForeignKeys,
  UtteranceEntity,
  VariableEntity,
} from '@voiceflow/orm-designer';
import { DatabaseTarget, FolderORM } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { CMSObjectService, EntitySerializer } from '@/common';
import { assistantBroadcastContext, groupByAssistant, toEntityIDs } from '@/common/utils';
import { EntityService } from '@/entity/entity.service';
import { FunctionService } from '@/function/function.service';
import { IntentService } from '@/intent/intent.service';
import { cloneManyEntities } from '@/utils/entity.util';
import { VariableService } from '@/variable/variable.service';

import type { FolderExportImportDataDTO } from './dtos/folder-export-import-data.dto';
import type { FolderCreateData } from './folder.interface';

@Injectable()
export class FolderService extends CMSObjectService<FolderORM> {
  constructor(
    @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
    private readonly postgresEM: EntityManager,
    @Inject(FolderORM)
    protected readonly orm: FolderORM,
    @Inject(LoguxService)
    private readonly logux: LoguxService,
    @Inject(EntityService)
    private readonly entity: EntityService,
    @Inject(IntentService)
    private readonly intent: IntentService,
    @Inject(VariableService)
    private readonly variable: VariableService,
    @Inject(FunctionService)
    private readonly functionService: FunctionService,
    @Inject(EntitySerializer)
    protected readonly entitySerializer: EntitySerializer
  ) {
    super();
  }

  /* Find */

  async findManyWithSubResourcesByEnvironment(assistantID: string, environmentID: string) {
    const folders = await this.orm.findManyByEnvironment(assistantID, environmentID);

    return {
      folders,
    };
  }

  async findManyWithSubResourcesJSONByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    const folders = await this.orm.findAllJSON({ assistant, environmentID });

    return {
      folders,
    };
  }

  async findManyChildren(ids: Primary<FolderEntity>[]): Promise<FolderEntity[]> {
    const children = await this.orm.findManyParents(ids);

    if (children.length) {
      return [...children, ...(await this.findManyChildren(children))];
    }

    return children;
  }

  async findManyWithChildren(ids: Primary<FolderEntity>[]): Promise<FolderEntity[]> {
    const [folders, children] = await Promise.all([this.findMany(ids), this.findManyChildren(ids)]);

    return [...folders, ...children];
  }

  /* Export */

  prepareExportData({ folders }: { folders: FolderEntity[] }, { backup }: { backup?: boolean } = {}): FolderExportImportDataDTO {
    if (backup) {
      return {
        folders: this.entitySerializer.iterable(folders),
      };
    }

    return {
      folders: this.entitySerializer.iterable(folders, { omit: ['assistantID', 'environmentID', 'updatedAt', 'updatedByID'] }),
    };
  }

  prepareExportJSONData({ folders }: { folders: ToJSONWithForeignKeys<FolderEntity>[] }): FolderExportImportDataDTO {
    return {
      folders: folders.map((item) => Utils.object.omit(item, ['assistantID', 'environmentID', 'updatedAt', 'updatedByID'])),
    };
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
    const { folders: sourceFolders } = await this.findManyWithSubResourcesByEnvironment(sourceAssistantID, sourceEnvironmentID);

    const result = this.importManyWithSubResources(
      {
        folders: cloneManyEntities(sourceFolders, { assistantID: targetAssistantID, environmentID: targetEnvironmentID }),
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
    { folders }: FolderExportImportDataDTO,
    { userID, backup, assistantID, environmentID }: { userID: number; backup?: boolean; assistantID: string; environmentID: string }
  ): { folders: ToJSONWithForeignKeys<FolderEntity>[] } {
    const createdAt = new Date().toJSON();

    if (backup) {
      return {
        folders: folders.map((item) => ({
          ...item,
          createdAt: item.createdAt ?? createdAt,
          updatedAt: item.updatedAt ?? createdAt,
          updatedByID: item.updatedByID ?? userID,
          assistantID,
          environmentID,
        })),
      };
    }

    return {
      folders: folders.map((item) => ({
        ...item,
        createdAt,
        updatedAt: createdAt,
        createdByID: userID,
        updatedByID: userID,
        assistantID,
        environmentID,
      })),
    };
  }

  async importManyWithSubResources(
    data: {
      folders: ToJSONWithForeignKeys<FolderEntity>[];
    },
    { flush = true }: ORMMutateOptions = {}
  ) {
    const [folders] = await Promise.all([this.createMany(data.folders, { flush: false })]);

    if (flush) {
      await this.orm.em.flush();
    }

    return {
      folders,
    };
  }

  /* Create */

  async createManyAndSync(userID: number, data: FolderCreateData[]) {
    return this.postgresEM.transactional(async () => {
      const folders = await this.createManyForUser(userID, data, { flush: false });

      await this.orm.em.flush();

      return {
        add: { folders },
      };
    });
  }

  async broadcastAddMany(authMeta: AuthMetaPayload, { add }: { add: { folders: FolderEntity[] } }) {
    await Promise.all([
      ...groupByAssistant(add.folders).map((folders) =>
        this.logux.processAs(
          Actions.Folder.AddMany({
            data: this.entitySerializer.iterable(folders),
            context: assistantBroadcastContext(folders[0]),
          }),
          authMeta
        )
      ),
    ]);
  }

  async createManyAndBroadcast(authMeta: AuthMetaPayload, data: FolderCreateData[]) {
    const result = await this.createManyAndSync(authMeta.userID, data);

    await this.broadcastAddMany(authMeta, result);

    return result.add.folders;
  }

  /* Delete */

  async collectRelationsToDelete(folders: PKOrEntity<FolderEntity>[]) {
    const [intents, entities, variables, functions] = await Promise.all([
      this.intent.findManyByFolders(folders),
      this.entity.findManyByFolders(folders),
      this.variable.findManyByFolders(folders),
      this.functionService.findManyByFolders(folders),
    ]);

    const [intentRelations, entityRelations, variableRelations] = await Promise.all([
      this.intent.collectRelationsToDelete(intents),
      this.entity.collectRelationsToDelete(entities),
      this.functionService.collectRelationsToDelete(functions),
    ]);

    return {
      ...intentRelations,
      ...entityRelations,
      ...variableRelations,
      intents,
      entities,
      variables,
      functions,
    };
  }

  deleteManyByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string): Promise<void> {
    return this.orm.deleteManyByEnvironment(assistant, environmentID);
  }

  async deleteManyAndSync(ids: Primary<FolderEntity>[]) {
    return this.postgresEM.transactional(async () => {
      const folders = await this.findManyWithChildren(ids);
      const relations = await this.collectRelationsToDelete(folders);

      const entitySync = await this.entity.syncRelationsOnDelete(relations, { flush: false });

      const systemVariables = relations.variables.filter((variable) => variable.isSystem);

      // moving system variables to the top level
      systemVariables.forEach((variable) => {
        // eslint-disable-next-line no-param-reassign
        variable.folder = null;
      });

      await this.deleteMany(folders, { flush: false });

      await this.orm.em.flush();

      return {
        sync: { ...entitySync, variables: systemVariables },
        delete: {
          ...relations,
          folders,
          variables: relations.variables.filter((variable) => !variable.isSystem),
        },
      };
    });
  }

  async broadcastDeleteMany(
    authMeta: AuthMetaPayload,
    {
      sync,
      delete: del,
    }: {
      sync: {
        intents: IntentEntity[];
        variables: VariableEntity[];
      };
      delete: {
        folders: FolderEntity[];
        intents: IntentEntity[];
        entities: EntityEntity[];
        variables: VariableEntity[];
        functions: FunctionEntity[];
        utterances: UtteranceEntity[];
        functionPaths: FunctionPathEntity[];
        entityVariants: EntityVariantEntity[];
        requiredEntities: RequiredEntityEntity[];
        functionVariables: FunctionVariableEntity[];
      };
    }
  ) {
    await Promise.all([
      this.entity.broadcastDeleteMany(authMeta, {
        sync: Utils.object.pick(sync, ['intents']),
        delete: Utils.object.pick(del, ['entities', 'entityVariants', 'requiredEntities']),
      }),

      this.intent.broadcastDeleteMany(authMeta, {
        delete: Utils.object.pick(del, ['intents', 'utterances', 'requiredEntities']),
      }),

      this.variable.broadcastDeleteMany(authMeta, {
        delete: Utils.object.pick(del, ['variables']),
      }),

      this.functionService.broadcastDeleteMany(authMeta, {
        delete: Utils.object.pick(del, ['functions', 'functionPaths', 'functionVariables']),
      }),

      // moving system variables to the top level
      ...groupByAssistant(sync.variables).flatMap((variables) =>
        variables.map((variable) =>
          this.logux.processAs(
            Actions.Variable.PatchOne({
              id: variable.id,
              patch: { folderID: null },
              context: assistantBroadcastContext(variable),
            }),
            authMeta
          )
        )
      ),

      ...groupByAssistant(del.folders).map((folders) =>
        this.logux.processAs(
          Actions.Folder.DeleteMany({
            ids: toEntityIDs(folders),
            context: assistantBroadcastContext(folders[0]),
          }),
          authMeta
        )
      ),
    ]);
  }

  async deleteManyAndBroadcast(authMeta: AuthMetaPayload, ids: Primary<FolderEntity>[]): Promise<void> {
    const result = await this.deleteManyAndSync(ids);

    await this.broadcastDeleteMany(authMeta, result);
  }

  /* Upsert */

  async upsertManyWithSubResources(data: { folders: Folder[] }, meta: { userID: number; assistantID: string; environmentID: string }) {
    const { folders } = this.prepareImportData(data, meta);

    await this.upsertMany(folders);
  }
}
