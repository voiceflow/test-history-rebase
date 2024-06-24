/* eslint-disable max-params */
import type { EntityManager } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { Folder } from '@voiceflow/dtos';
import { LoguxService } from '@voiceflow/nestjs-logux';
import type {
  AnyResponseAttachmentObject,
  AnyResponseVariantObject,
  DiagramObject,
  EntityObject,
  EntityVariantObject,
  FlowObject,
  FolderJSON,
  FolderObject,
  FunctionObject,
  FunctionPathObject,
  FunctionVariableObject,
  IntentObject,
  ReferenceObject,
  ReferenceResourceObject,
  RequiredEntityObject,
  ResponseDiscriminatorObject,
  ResponseMessageObject,
  ResponseObject,
  UtteranceObject,
  VariableObject,
  WorkflowObject,
} from '@voiceflow/orm-designer';
import { DatabaseTarget, FolderORM } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { CMSObjectService } from '@/common';
import { cmsBroadcastContext, injectAssistantAndEnvironmentIDs, toPostgresEntityIDs } from '@/common/utils';
import { DiagramService } from '@/diagram/diagram.service';
import { EntityService } from '@/entity/entity.service';
import { FlowService } from '@/flow/flow.service';
import { FunctionService } from '@/function/function.service';
import { IntentService } from '@/intent/intent.service';
import { ReferenceService } from '@/reference/reference.service';
import { ResponseService } from '@/response/response.service';
import { CMSBroadcastMeta, CMSContext } from '@/types';
import { VariableService } from '@/variable/variable.service';
import { WorkflowService } from '@/workflow/workflow.service';

import type { FolderExportImportDataDTO } from './dtos/folder-export-import-data.dto';
import type { FolderCreateData } from './folder.interface';

@Injectable()
export class FolderService extends CMSObjectService<FolderORM> {
  toJSON = this.orm.jsonAdapter.fromDB;

  fromJSON = this.orm.jsonAdapter.toDB;

  mapToJSON = this.orm.jsonAdapter.mapFromDB;

  mapFromJSON = this.orm.jsonAdapter.mapToDB;

  constructor(
    @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
    private readonly postgresEM: EntityManager,
    @Inject(FolderORM)
    protected readonly orm: FolderORM,
    @Inject(FlowService)
    private readonly flow: FlowService,
    @Inject(LoguxService)
    private readonly logux: LoguxService,
    @Inject(EntityService)
    private readonly entity: EntityService,
    @Inject(IntentService)
    private readonly intent: IntentService,
    @Inject(DiagramService)
    private readonly diagram: DiagramService,
    @Inject(VariableService)
    private readonly variable: VariableService,
    @Inject(WorkflowService)
    private readonly workflow: WorkflowService,
    @Inject(ReferenceService)
    private readonly reference: ReferenceService,
    @Inject(FunctionService)
    private readonly functionService: FunctionService,
    @Inject(ResponseService)
    private readonly responseService: ResponseService
  ) {
    super();
  }

  /* Find */

  findManyByEnvironmentAndIDs(environmentID: string, ids: string[]) {
    return this.orm.findManyByEnvironmentAndIDs(environmentID, ids);
  }

  async findManyWithSubResourcesByEnvironment(environmentID: string) {
    const folders = await this.orm.findManyByEnvironment(environmentID);

    return {
      folders,
    };
  }

  async findManyByParents(environmentID: string, parentIDs: string[]): Promise<FolderObject[]> {
    const children = await this.orm.findManyParents(environmentID, parentIDs);

    if (children.length) {
      return [...children, ...(await this.findManyByParents(environmentID, toPostgresEntityIDs(children)))];
    }

    return children;
  }

  async findManyWithChildren(environmentID: string, folderIDs: string[]) {
    const [folders, children] = await Promise.all([
      this.findManyByEnvironmentAndIDs(environmentID, folderIDs),
      this.findManyByParents(environmentID, folderIDs),
    ]);

    return [...folders, ...children];
  }

  /* Export */

  toJSONWithSubResources({ folders }: { folders: FolderObject[] }) {
    return {
      folders: this.mapToJSON(folders),
    };
  }

  fromJSONWithSubResources({ folders }: FolderExportImportDataDTO) {
    return {
      folders: this.mapFromJSON(folders),
    };
  }

  prepareExportData(
    data: { folders: FolderObject[] },
    { backup }: { backup?: boolean } = {}
  ): FolderExportImportDataDTO {
    const json = this.toJSONWithSubResources(data);

    if (backup) {
      return json;
    }

    return {
      folders: json.folders.map((item) =>
        Utils.object.omit(item, ['assistantID', 'environmentID', 'updatedAt', 'updatedByID'])
      ),
    };
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
    const { folders: sourceFolders } = await this.findManyWithSubResourcesByEnvironment(sourceEnvironmentID);

    return this.importManyWithSubResources({
      folders: sourceFolders.map((item) => ({
        ...item,
        assistantID: targetAssistantID,
        environmentID: targetEnvironmentID,
      })),
    });
  }

  /* Import */

  prepareImportData(
    { folders }: FolderExportImportDataDTO,
    {
      userID,
      backup,
      assistantID,
      environmentID,
    }: { userID: number; backup?: boolean; assistantID: string; environmentID: string }
  ): { folders: FolderJSON[] } {
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
        updatedByID: userID,
        assistantID,
        environmentID,
      })),
    };
  }

  async importManyWithSubResources(data: { folders: FolderObject[] }) {
    const folders = await this.createMany(data.folders);

    return {
      folders,
    };
  }

  async importManyWithSubResourcesFromJSON({ folders }: FolderExportImportDataDTO) {
    await this.importManyWithSubResources(
      this.fromJSONWithSubResources({
        folders,
      })
    );
  }

  /* Create */

  async createManyAndSync(data: FolderCreateData[], { userID, context }: { userID: number; context: CMSContext }) {
    const folders = await this.createManyForUser(userID, data.map(injectAssistantAndEnvironmentIDs(context)));

    return {
      add: { folders },
    };
  }

  async broadcastAddMany({ add }: { add: { folders: FolderObject[] } }, meta: CMSBroadcastMeta) {
    await this.logux.processAs(
      Actions.Folder.AddMany({
        data: this.mapToJSON(add.folders),
        context: cmsBroadcastContext(meta.context),
      }),
      meta.auth
    );
  }

  async createManyAndBroadcast(data: FolderCreateData[], meta: CMSBroadcastMeta) {
    const result = await this.createManyAndSync(data, { userID: meta.auth.userID, context: meta.context });

    await this.broadcastAddMany(result, meta);

    return result.add.folders;
  }

  /* Delete */

  async collectRelationsToDelete(environmentID: string, folderIDs: string[]) {
    const [flows, intents, entities, variables, workflows, functions, responses] = await Promise.all([
      this.flow.findManyByFolders(environmentID, folderIDs),
      this.intent.findManyByFolders(environmentID, folderIDs),
      this.entity.findManyByFolders(environmentID, folderIDs),
      this.variable.findManyByFolders(environmentID, folderIDs),
      this.workflow.findManyByFolders(environmentID, folderIDs),
      this.functionService.findManyByFolders(environmentID, folderIDs),
      this.responseService.findManyByFolders(environmentID, folderIDs),
    ]);

    const [flowRelations, intentRelations, entityRelations, workflowsRelations, functionRelations, responseRelations] =
      await Promise.all([
        this.flow.collectRelationsToDelete(flows),
        this.intent.collectRelationsToDelete(environmentID, toPostgresEntityIDs(intents)),
        this.entity.collectRelationsToDelete(environmentID, toPostgresEntityIDs(entities)),
        this.workflow.collectRelationsToDelete(workflows),
        this.functionService.collectRelationsToDelete(environmentID, toPostgresEntityIDs(functions)),
        this.responseService.collectRelationsToDelete(environmentID, toPostgresEntityIDs(functions)),
      ]);

    return {
      ...Utils.object.omit(flowRelations, ['diagrams']),
      ...intentRelations,
      ...entityRelations,
      ...functionRelations,
      ...responseRelations,
      ...Utils.object.omit(workflowsRelations, ['diagrams']),
      flows,
      intents,
      entities,
      variables,
      functions,
      workflows,
      responses,
      flowDiagrams: flowRelations.diagrams,
      workflowDiagrams: workflowsRelations.diagrams,
    };
  }

  deleteManyByEnvironment(environmentID: string) {
    return this.orm.deleteManyByEnvironment(environmentID);
  }

  async deleteManyAndSync(ids: string[], { userID, context }: { userID: number; context: CMSContext }) {
    const result = await this.postgresEM.transactional(async () => {
      const folders = await this.findManyWithChildren(context.environmentID, ids);
      const relations = await this.collectRelationsToDelete(context.environmentID, toPostgresEntityIDs(folders));
      const entitySync = await this.entity.syncRelationsOnDelete(relations, { userID, context });

      const startWorkflow = relations.workflows.find((workflow) => workflow.isStart);
      const systemVariables = relations.variables.filter((variable) => variable.isSystem);

      await Promise.all([
        // moving system variables to the top level
        systemVariables.length
          ? this.variable.patchManyForUser(
              userID,
              systemVariables.map((variable) => ({ id: variable.id, environmentID: context.environmentID })),
              { folderID: null }
            )
          : Promise.resolve(),

        // moving start workflow to the top level
        startWorkflow
          ? this.workflow.patchOneForUser(
              userID,
              { id: startWorkflow.id, environmentID: startWorkflow.environmentID },
              { folderID: null }
            )
          : Promise.resolve(),
      ]);

      const [
        intentReferencesResult,
        flowReferencesResult,
        workflowReferencesResult,
        functionReferencesResult,
        responseReferencesResult,
      ] = await Promise.all([
        this.reference.deleteManyWithSubResourcesAndSyncByIntentIDs({
          userID,
          intentIDs: relations.intents.map((intent) => intent.id),
          assistantID: context.assistantID,
          environmentID: context.environmentID,
        }),
        this.reference.deleteManyWithSubResourcesAndSyncByDiagramIDs({
          userID,
          diagramIDs: relations.flows.map((flow) => flow.diagramID),
          assistantID: context.assistantID,
          environmentID: context.environmentID,
        }),
        this.reference.deleteManyWithSubResourcesAndSyncByDiagramIDs({
          userID,
          diagramIDs: relations.workflows.map((workflow) => workflow.diagramID),
          assistantID: context.assistantID,
          environmentID: context.environmentID,
        }),
        this.reference.deleteManyWithSubResourcesAndSyncByFunctionIDs({
          userID,
          functionIDs: relations.functions.map((fn) => fn.id),
          assistantID: context.assistantID,
          environmentID: context.environmentID,
        }),
        this.reference.deleteManyWithSubResourcesAndSyncByResponseIDs({
          userID,
          responseIDs: relations.responses.map((response) => response.id),
          assistantID: context.assistantID,
          environmentID: context.environmentID,
        }),
      ]);

      await this.deleteMany(folders);

      return {
        sync: {
          ...entitySync,
          variables: systemVariables,
          workflows: startWorkflow ? [startWorkflow] : [],
          requiredEntities: relations.requiredEntities,
        },
        delete: {
          ...relations,
          folders,
          variables: relations.variables.filter((variable) => !variable.isSystem),
          workflows: relations.workflows.filter((workflow) => !workflow.isStart),
          workflowDiagrams: startWorkflow
            ? relations.workflowDiagrams.filter((diagram) => startWorkflow.diagramID !== diagram.diagramID.toJSON())
            : relations.workflowDiagrams,
          flowReferences: flowReferencesResult.delete.references,
          intentReferences: intentReferencesResult.delete.references,
          workflowReferences: workflowReferencesResult.delete.references,
          functionReferences: functionReferencesResult.delete.references,
          responseReferences: responseReferencesResult.delete.references,
          flowReferenceResources: flowReferencesResult.delete.referenceResources,
          intentReferenceResources: intentReferencesResult.delete.referenceResources,
          workflowReferenceResources: workflowReferencesResult.delete.referenceResources,
          functionReferenceResources: functionReferencesResult.delete.referenceResources,
          responseReferenceResources: responseReferencesResult.delete.referenceResources,
        },
      };
    });

    await this.diagram.deleteManyByVersionIDAndDiagramIDs(
      context.environmentID,
      [...result.delete.flowDiagrams, ...result.delete.workflowDiagrams].map((item) => item.diagramID.toJSON())
    );

    return result;
  }

  async broadcastDeleteMany(
    {
      sync,
      delete: del,
    }: {
      sync: {
        intents: IntentObject[];
        workflows: WorkflowObject[];
        variables: VariableObject[];
        requiredEntities: RequiredEntityObject[];
      };
      delete: {
        flows: FlowObject[];
        folders: FolderObject[];
        intents: IntentObject[];
        entities: EntityObject[];
        responses: ResponseObject[];
        variables: VariableObject[];
        workflows: WorkflowObject[];
        functions: FunctionObject[];
        utterances: UtteranceObject[];
        flowDiagrams: DiagramObject[];
        functionPaths: FunctionPathObject[];
        entityVariants: EntityVariantObject[];
        flowReferences: ReferenceObject[];
        intentReferences: ReferenceObject[];
        workflowDiagrams: DiagramObject[];
        requiredEntities: RequiredEntityObject[];
        responseVariants: AnyResponseVariantObject[];
        responseMessages: ResponseMessageObject[];
        functionVariables: FunctionVariableObject[];
        workflowReferences: ReferenceObject[];
        functionReferences: ReferenceObject[];
        responseReferences: ReferenceObject[];
        responseAttachments: AnyResponseAttachmentObject[];
        responseDiscriminators: ResponseDiscriminatorObject[];
        flowReferenceResources: ReferenceResourceObject[];
        intentReferenceResources: ReferenceResourceObject[];
        workflowReferenceResources: ReferenceResourceObject[];
        functionReferenceResources: ReferenceResourceObject[];
        responseReferenceResources: ReferenceResourceObject[];
      };
    },
    meta: CMSBroadcastMeta
  ) {
    await Promise.all([
      this.flow.broadcastDeleteMany(
        {
          delete: {
            flows: del.flows,
            diagrams: del.flowDiagrams,
            references: del.flowReferences,
            referenceResources: del.flowReferenceResources,
          },
        },
        meta
      ),

      this.entity.broadcastDeleteMany(
        {
          sync: Utils.object.pick(sync, ['intents']),
          delete: Utils.object.pick(del, ['entities', 'entityVariants', 'requiredEntities']),
        },
        meta
      ),

      this.intent.broadcastDeleteMany(
        {
          delete: {
            intents: del.intents,
            utterances: del.utterances,
            references: del.intentReferences,
            requiredEntities: del.requiredEntities,
            referenceResources: del.intentReferenceResources,
          },
        },
        meta
      ),

      this.variable.broadcastDeleteMany(
        {
          delete: Utils.object.pick(del, ['variables']),
        },
        meta
      ),

      this.workflow.broadcastDeleteMany(
        {
          delete: {
            diagrams: del.workflowDiagrams,
            workflows: del.workflows,
            references: del.workflowReferences,
            referenceResources: del.workflowReferenceResources,
          },
        },
        meta
      ),

      this.functionService.broadcastDeleteMany(
        {
          delete: {
            functions: del.functions,
            references: del.functionReferences,
            functionPaths: del.functionPaths,
            functionVariables: del.functionVariables,
            referenceResources: del.functionReferenceResources,
          },
        },
        meta
      ),

      this.responseService.broadcastDeleteMany(
        {
          sync: Utils.object.pick(sync, ['requiredEntities']),
          delete: {
            responses: del.responses,
            references: del.responseReferences,
            responseVariants: del.responseVariants,
            responseMessages: del.responseMessages,
            referenceResources: del.responseReferenceResources,
            responseAttachments: del.responseAttachments,
            responseDiscriminators: del.responseDiscriminators,
          },
        },
        meta
      ),

      // moving system variables to the top level
      this.logux.processAs(
        Actions.Variable.PatchMany({
          ids: toPostgresEntityIDs(sync.variables),
          patch: { folderID: null },
          context: cmsBroadcastContext(meta.context),
        }),
        meta.auth
      ),

      // moving start workflow to the top level
      this.logux.processAs(
        Actions.Workflow.PatchMany({
          ids: toPostgresEntityIDs(sync.workflows),
          patch: { folderID: null },
          context: cmsBroadcastContext(meta.context),
        }),
        meta.auth
      ),

      this.logux.processAs(
        Actions.Folder.DeleteMany({
          ids: toPostgresEntityIDs(del.folders),
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
    data: { folders: Folder[] },
    meta: { userID: number; assistantID: string; environmentID: string }
  ) {
    const { folders } = this.prepareImportData(data, meta);

    await this.upsertMany(this.mapFromJSON(folders));
  }
}
