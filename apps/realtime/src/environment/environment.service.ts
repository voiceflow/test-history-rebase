/* eslint-disable max-params */
import { EntityManager } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import {
  AnyResponseVariant,
  Entity,
  EntityVariant,
  Intent,
  RequiredEntity,
  Response,
  ResponseDiscriminator,
  Utterance,
  VersionPrototype,
} from '@voiceflow/dtos';
import { UnleashFeatureFlagService } from '@voiceflow/nestjs-common';
import {
  AnyResponseVariantObject,
  DatabaseTarget,
  DiagramObject,
  EntityObject,
  EntityVariantObject,
  IntentObject,
  ObjectId,
  RequiredEntityObject,
  ResponseDiscriminatorObject,
  ResponseObject,
  UtteranceObject,
  VariableObject,
  VersionJSON,
  VersionObject,
} from '@voiceflow/orm-designer';
import * as Platform from '@voiceflow/platform-config/backend';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Patch } from 'immer';
import { Merge } from 'type-fest';

import { AttachmentService } from '@/attachment/attachment.service';
import { DiagramService } from '@/diagram/diagram.service';
import { DiagramUtil } from '@/diagram/diagram.util';
import { EntityService } from '@/entity/entity.service';
import { FlowService } from '@/flow/flow.service';
import { FolderService } from '@/folder/folder.service';
import { FunctionService } from '@/function/function.service';
import { IntentService } from '@/intent/intent.service';
import { ProjectService } from '@/project/project.service';
import { ResponseService } from '@/response/response.service';
import { VariableService } from '@/variable/variable.service';
import { VersionService } from '@/version/version.service';
import { WorkflowService } from '@/workflow/workflow.service';

import { EnvironmentCMSExportImportDataDTO } from './dtos/environment-cms-export-import-data.dto';
import { EnvironmentExportDTO } from './dtos/environment-export-data.dto';
import { EnvironmentImportDTO } from './dtos/environment-import-data.dto';
import { EnvironmentCMSData } from './environment.interface';
import { EnvironmentUtil } from './environment.util';
import { EnvironmentNLUTrainingUtil } from './environment-nlu-training.util';

@Injectable()
export class EnvironmentService {
  constructor(
    @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
    private readonly postgresEM: EntityManager,
    @Inject(FlowService)
    private readonly flow: FlowService,
    @Inject(IntentService)
    private readonly intent: IntentService,
    @Inject(EntityService)
    private readonly entity: EntityService,
    @Inject(FolderService)
    private readonly folder: FolderService,
    @Inject(DiagramService)
    private readonly diagram: DiagramService,
    @Inject(ProjectService)
    private readonly project: ProjectService,
    @Inject(UnleashFeatureFlagService)
    private readonly unleash: UnleashFeatureFlagService,
    @Inject(VersionService)
    private readonly version: VersionService,
    @Inject(ResponseService)
    private readonly response: ResponseService,
    @Inject(VariableService)
    private readonly variable: VariableService,
    @Inject(WorkflowService)
    private readonly workflow: WorkflowService,
    @Inject(AttachmentService)
    private readonly attachment: AttachmentService,
    @Inject(FunctionService)
    private readonly functionService: FunctionService,
    @Inject(EnvironmentUtil)
    private readonly util: EnvironmentUtil,
    @Inject(DiagramUtil)
    private readonly diagramUtil: DiagramUtil,
    @Inject(EnvironmentNLUTrainingUtil)
    private readonly nluTrainingUtil: EnvironmentNLUTrainingUtil
  ) {}

  /* Helpers */

  private convertCMSResourcesToLegacyResources({
    intents,
    entities,
    variables,
    responses,
    utterances,
    entityVariants,
    isVoiceAssistant,
    responseVariants,
    requiredEntities,
    responseDiscriminators,
  }: {
    intents: IntentObject[];
    entities: EntityObject[];
    responses: ResponseObject[];
    variables: VariableObject[];
    utterances: UtteranceObject[];
    entityVariants: EntityVariantObject[];
    isVoiceAssistant: boolean;
    requiredEntities: RequiredEntityObject[];
    responseVariants: AnyResponseVariantObject[];
    responseDiscriminators: ResponseDiscriminatorObject[];
  }) {
    const { entities: entitiesJSON, entityVariants: entityVariantsJSON } = this.entity.toJSONWithSubResources({ entities, entityVariants });
    const { variables: variablesJSON } = this.variable.toJSONWithSubResources({ variables });

    const legacySlots = Realtime.Adapters.entityToLegacySlot.mapFromDB({
      entities: entitiesJSON,
      entityVariants: entityVariantsJSON,
    });

    const { intents: legacyIntents } = Realtime.Adapters.intentToLegacyIntent.mapFromDB(
      {
        ...this.intent.toJSONWithSubResources({ intents, utterances, requiredEntities }),
        ...this.response.toJSONWithSubResources({ responses, responseVariants, responseAttachments: [], responseDiscriminators }),
      },
      {
        entities: entitiesJSON,
        variables: variablesJSON,
        isVoiceAssistant,
      }
    );
    const legacyVariables = Realtime.Adapters.variableToLegacyVariableAdapter.mapFromDB(variablesJSON);

    return {
      legacySlots,
      legacyIntents,
      legacyVariables,
    };
  }

  toJSONWithSubResources(data: EnvironmentCMSData & { version: VersionObject; diagrams: DiagramObject[] }) {
    return {
      ...this.toJSONCMSData(data),
      version: this.version.toJSON(data.version),
      diagrams: this.diagram.mapToJSON(data.diagrams),
    };
  }

  toJSONCMSData(data: EnvironmentCMSData) {
    return {
      ...this.flow.toJSONWithSubResources(data),
      ...this.entity.toJSONWithSubResources(data),
      ...this.folder.toJSONWithSubResources(data),
      ...this.intent.toJSONWithSubResources(data),
      ...this.workflow.toJSONWithSubResources(data),
      ...this.response.toJSONWithSubResources(data),
      ...this.variable.toJSONWithSubResources(data),
      ...this.attachment.toJSONWithSubResources(data),
      ...this.functionService.toJSONWithSubResources(data),
    };
  }

  /* Find */

  async findManyForAssistantID(assistantID: string) {
    const project = await this.project.findOneOrFailWithFields(assistantID, ['liveVersion', 'devVersion', 'previewVersion']);

    const tagsMap: Record<string, 'production' | 'development' | 'preview'> = {};

    if (project.devVersion) tagsMap[project.devVersion.toJSON()] = 'development';
    if (project.liveVersion) tagsMap[project.liveVersion.toJSON()] = 'production';
    if (project.previewVersion) tagsMap[project.previewVersion.toJSON()] = 'preview';

    const versions = await this.version.findManyWithFields(Object.keys(tagsMap), ['_id', 'name', 'creatorID', 'updatedAt']);

    return versions.map((version) => {
      const tag = tagsMap[version._id.toJSON()];

      return {
        tag,
        environment: this.version.toJSON({ ...version, name: tag === 'development' ? 'Development' : version.name }),
      };
    });
  }

  /* Prototype */
  async preparePrototype(environmentID: string) {
    let version = await this.version.findOneOrFail(environmentID);

    const [project, diagrams, cmsData] = await Promise.all([
      this.project.findOneOrFail(version.projectID),
      this.diagram.findManyByVersionID(environmentID),
      // using transaction to optimize connections
      this.postgresEM.transactional(() => this.findOneCMSData(environmentID)),
    ]);

    const { legacySlots, legacyIntents, legacyVariables } = this.convertCMSResourcesToLegacyResources({
      ...cmsData,
      isVoiceAssistant:
        Realtime.legacyPlatformToProjectType(project.platform, project.type, project.nlu).type === Platform.Constants.ProjectType.VOICE,
    });

    await Promise.all([
      this.version.patchOnePlatformData(environmentID, { intents: legacyIntents, slots: legacySlots }),
      this.version.patchOne(environmentID, { variables: Utils.array.unique([...version.variables, ...legacyVariables]) }),
    ]);

    // fetching version to get updated platformData
    version = await this.version.findOneOrFail(environmentID);

    return {
      ...cmsData,
      version,
      project,
      diagrams,
      liveDiagramIDs: VersionService.getLiveDiagramIDs(version, diagrams),
    };
  }

  /* Import  */

  prepareImportData(
    data: EnvironmentImportDTO,
    {
      userID,
      backup,
      assistantID,
      workspaceID,
      environmentID,
      centerDiagrams,
    }: { userID: number; backup?: boolean; workspaceID: number; assistantID: string; environmentID: string; centerDiagrams?: boolean }
  ) {
    const createdAt = new Date().toJSON();

    const version = {
      ...data.version,
      updatedAt: backup ? data.version.updatedAt ?? new ObjectId(data.version._id).getTimestamp().toJSON() : createdAt,
      prototype: data.version.prototype as VersionPrototype | undefined,
    };

    if (version.prototype?.settings) {
      delete version.prototype.settings.variableStateID;
    }

    const diagrams = Object.values(data.diagrams).map((diagram) => {
      const newDiagram = { ...diagram, diagramID: diagram.diagramID ?? diagram._id };

      return centerDiagrams ? this.diagramUtil.center(newDiagram) : newDiagram;
    });

    const cmsData = this.prepareImportCMSData(data, { userID, backup, assistantID, workspaceID, environmentID });

    return {
      ...cmsData,
      version,
      diagrams,
    };
  }

  public async importJSON({
    data,
    userID,
    assistantID,
    environmentID,
  }: {
    data: ReturnType<EnvironmentService['prepareImportData']>;
    userID: number;
    workspaceID: number;
    assistantID: string;
    environmentID: string;
  }) {
    const { version, diagrams } = await this.version.importOneJSON({
      sourceVersion: data.version,
      sourceDiagrams: data.diagrams,
      sourceVersionOverride: { _id: environmentID, projectID: assistantID, creatorID: userID },
    });

    await this.importCMSData(data);

    return {
      version,
      diagrams,
    };
  }

  /* Export  */

  public prepareExportCMSData(data: EnvironmentCMSData, { userID, backup, workspaceID }: { userID: number; backup?: boolean; workspaceID: number }) {
    const cmsFunctionsEnabled = this.unleash.isEnabled(Realtime.FeatureFlag.CMS_FUNCTIONS, { userID, workspaceID });

    return {
      ...this.flow.prepareExportData(data, { backup }),
      ...this.entity.prepareExportData(data, { backup }),
      ...this.intent.prepareExportData(data, { backup }),
      ...this.folder.prepareExportData(data, { backup }),
      ...this.response.prepareExportData(data, { backup }),
      ...this.variable.prepareExportData(data, { backup }),
      ...this.workflow.prepareExportData(data, { backup }),
      ...this.attachment.prepareExportData(data, { backup }),

      ...(cmsFunctionsEnabled && this.functionService.prepareExportData(data, { backup })),
    };
  }

  public prepareExportData(
    data: {
      cms: EnvironmentCMSData | null;
      version: VersionObject;
      diagrams: DiagramObject[];
    },
    { userID, backup, workspaceID, centerDiagrams = true }: { userID: number; backup?: boolean; workspaceID: number; centerDiagrams?: boolean }
  ): EnvironmentExportDTO {
    const version = this.version.toJSON(data.version);
    const diagrams = this.diagram
      .mapToJSON(data.diagrams)
      .map((diagram) => this.diagramUtil.cleanupNodes(centerDiagrams ? this.diagramUtil.center(diagram) : diagram));

    // Remove stored `variableStateID` to avoid referencing the state from another user
    if (version.prototype && Utils.object.isObject(version.prototype) && Utils.object.isObject(version.prototype.settings)) {
      delete version.prototype.settings.variableStateID;
    }

    return {
      version: {
        ...version,
        _version: version?._version ?? 1,
      },

      diagrams: Object.fromEntries(diagrams.map((diagram) => [diagram.diagramID, diagram])),

      ...(data.cms && this.prepareExportCMSData(data.cms, { userID, backup, workspaceID })),
    };
  }

  public async exportJSON({ environmentID }: { userID: number; workspaceID: number; environmentID: string }) {
    const [cms, { version, diagrams }] = await Promise.all([this.findOneCMSData(environmentID), this.version.exportOne(environmentID)]);

    return {
      cms,
      version,
      diagrams,
    };
  }

  prepareImportCMSData(
    cms: EnvironmentCMSExportImportDataDTO,
    {
      userID,
      backup,
      workspaceID,
      assistantID,
      environmentID,
    }: { userID: number; backup?: boolean; workspaceID: number; assistantID: string; environmentID: string }
  ) {
    const cmsFunctionsEnabled = this.unleash.isEnabled(Realtime.FeatureFlag.CMS_FUNCTIONS, { userID, workspaceID });
    const cmsWorkflowsEnabled = this.unleash.isEnabled(Realtime.FeatureFlag.CMS_WORKFLOWS, { userID, workspaceID });

    const prepareDataContext = { userID, backup, assistantID, environmentID };

    return {
      ...(cms.flows && this.flow.prepareImportData({ flows: cms.flows }, prepareDataContext)),

      ...(cms.folders && this.folder.prepareImportData({ folders: cms.folders }, prepareDataContext)),

      ...(cms.variables && this.variable.prepareImportData({ variables: cms.variables }, prepareDataContext)),

      ...(cms.attachments &&
        cms.cardButtons &&
        this.attachment.prepareImportData({ attachments: cms.attachments, cardButtons: cms.cardButtons }, prepareDataContext)),

      ...(cms.entities &&
        cms.entityVariants &&
        this.entity.prepareImportData({ entities: cms.entities, entityVariants: cms.entityVariants }, prepareDataContext)),

      ...(cms.intents &&
        cms.utterances &&
        cms.requiredEntities &&
        this.intent.prepareImportData(
          { intents: cms.intents, utterances: cms.utterances, requiredEntities: cms.requiredEntities },
          prepareDataContext
        )),

      ...(cms.responses &&
        cms.responseVariants &&
        cms.responseAttachments &&
        cms.responseDiscriminators &&
        this.response.prepareImportData(
          {
            responses: cms.responses,
            responseVariants: cms.responseVariants,
            responseAttachments: cms.responseAttachments,
            responseDiscriminators: cms.responseDiscriminators,
          },
          prepareDataContext
        )),

      ...(cmsFunctionsEnabled &&
        cms.functions &&
        cms.functionPaths &&
        cms.functionVariables &&
        this.functionService.prepareImportData(
          { functions: cms.functions, functionPaths: cms.functionPaths, functionVariables: cms.functionVariables },
          prepareDataContext
        )),

      ...(cmsWorkflowsEnabled && cms.workflows && this.workflow.prepareImportData({ workflows: cms.workflows }, prepareDataContext)),
    };
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  async importCMSData(importData: ReturnType<EnvironmentService['prepareImportCMSData']>) {
    if (importData.folders?.length) {
      await this.folder.importManyWithSubResources(
        this.folder.fromJSONWithSubResources({
          folders: importData.folders,
        })
      );
    }

    if (importData.attachments?.length) {
      await this.attachment.importManyWithSubResources(
        this.attachment.fromJSONWithSubResources({
          attachments: importData.attachments,
          cardButtons: importData.cardButtons ?? [],
        })
      );
    }

    if (importData.responses?.length) {
      await this.response.importManyWithSubResources(
        this.response.fromJSONWithSubResources({
          responses: importData.responses,
          responseVariants: importData.responseVariants ?? [],
          responseAttachments: importData.responseAttachments ?? [],
          responseDiscriminators: importData.responseDiscriminators ?? [],
        })
      );
    }

    if (importData.entities?.length) {
      await this.entity.importManyWithSubResources(
        this.entity.fromJSONWithSubResources({
          entities: importData.entities,
          entityVariants: importData.entityVariants ?? [],
        })
      );
    }

    if (importData.intents?.length) {
      await this.intent.importManyWithSubResources(
        this.intent.fromJSONWithSubResources({
          intents: importData.intents,
          utterances: importData.utterances ?? [],
          requiredEntities: importData.requiredEntities ?? [],
        })
      );
    }

    if (importData.functions?.length) {
      await this.functionService.importManyWithSubResources(
        this.functionService.fromJSONWithSubResources({
          functions: importData.functions,
          functionPaths: importData.functionPaths ?? [],
          functionVariables: importData.functionVariables ?? [],
        })
      );
    }

    if (importData.variables?.length) {
      await this.variable.importManyWithSubResources(
        this.variable.fromJSONWithSubResources({
          variables: importData.variables,
        })
      );
    }

    if (importData.flows?.length) {
      await this.flow.importManyWithSubResources(
        this.flow.fromJSONWithSubResources({
          flows: importData.flows,
        })
      );
    }

    if (importData.workflows?.length) {
      await this.workflow.importManyWithSubResources(
        this.workflow.fromJSONWithSubResources({
          workflows: importData.workflows,
        })
      );
    }
  }

  async findOneCMSData(environmentID: string) {
    const [
      { flows },
      { entities, entityVariants },
      { intents, utterances, requiredEntities },
      { folders },
      { variables },
      { workflows },
      { responses, responseVariants, responseAttachments, responseDiscriminators },
      { attachments, cardButtons },
      { functions, functionPaths, functionVariables },
    ] = await Promise.all([
      this.flow.findManyWithSubResourcesByEnvironment(environmentID),
      this.entity.findManyWithSubResourcesByEnvironment(environmentID),
      this.intent.findManyWithSubResourcesByEnvironment(environmentID),
      this.folder.findManyWithSubResourcesByEnvironment(environmentID),
      this.variable.findManyWithSubResourcesByEnvironment(environmentID),
      this.workflow.findManyWithSubResourcesByEnvironment(environmentID),
      this.response.findManyWithSubResourcesByEnvironment(environmentID),
      this.attachment.findManyWithSubResourcesByEnvironment(environmentID),
      this.functionService.findManyWithSubResourcesByEnvironment(environmentID),
    ]);

    return {
      flows,
      folders,
      intents,
      entities,
      functions,
      responses,
      variables,
      workflows,
      utterances,
      attachments,
      cardButtons,
      functionPaths,
      entityVariants,
      requiredEntities,
      responseVariants,
      functionVariables,
      responseAttachments,
      responseDiscriminators,
    };
  }

  async findOneCMSDataToMigrate(environmentID: string) {
    const [{ variables }] = await Promise.all([this.variable.findManyWithSubResourcesByEnvironment(environmentID)]);

    return {
      variables,
    };
  }

  async upsertIntentsAndEntities(
    {
      intents,
      entities,
      responses,
      utterances,
      entityVariants,
      requiredEntities,
      responseVariants,
      responseDiscriminators,
    }: {
      intents: Intent[];
      entities: Entity[];
      responses: Response[];
      utterances: Utterance[];
      entityVariants: EntityVariant[];
      requiredEntities: RequiredEntity[];
      responseVariants: AnyResponseVariant[];
      responseDiscriminators: ResponseDiscriminator[];
    },
    meta: { userID: number; assistantID: string; environmentID: string }
  ) {
    // ORDER MATTERS
    await this.entity.upsertManyWithSubResources({ entities, entityVariants }, meta);
    await this.response.upsertManyWithSubResources({ responses, responseVariants, responseAttachments: [], responseDiscriminators }, meta);
    await this.intent.upsertManyWithSubResources({ intents, utterances, requiredEntities }, meta);
  }

  async migrateCMSData(data: Realtime.Migrate.MigrationData, patches: Patch[], meta: { userID: number; assistantID: string; environmentID: string }) {
    const {
      flows = [],
      folders = [],
      intents = [],
      entities = [],
      responses = [],
      variables = [],
      workflows = [],
      utterances = [],
      entityVariants = [],
      requiredEntities = [],
      responseVariants = [],
      responseDiscriminators = [],
    } = this.util.getUpdatedCMSData(data, patches);

    // ORDER MATTERS
    await this.flow.upsertManyWithSubResources({ flows }, meta);
    await this.folder.upsertManyWithSubResources({ folders }, meta);
    await this.workflow.upsertManyWithSubResources({ workflows }, meta);
    await this.variable.upsertManyWithSubResources({ variables }, meta);
    await this.entity.upsertManyWithSubResources({ entities, entityVariants }, meta);
    await this.response.upsertManyWithSubResources({ responses, responseVariants, responseAttachments: [], responseDiscriminators }, meta);
    await this.intent.upsertManyWithSubResources({ intents, utterances, requiredEntities }, meta);
  }

  async deleteOneCMSData(environmentID: string) {
    // needs to be done in multiple operations to avoid locks in reference tables
    await Promise.all([
      this.flow.deleteManyByEnvironment(environmentID),
      this.intent.deleteManyByEnvironment(environmentID),
      this.workflow.deleteManyByEnvironment(environmentID),
      this.functionService.deleteManyByEnvironment(environmentID),
    ]);

    await Promise.all([
      this.entity.deleteManyByEnvironment(environmentID),
      this.response.deleteManyByEnvironment(environmentID),
      this.variable.deleteManyByEnvironment(environmentID),
    ]);

    await Promise.all([this.folder.deleteManyByEnvironment(environmentID), this.attachment.deleteManyByEnvironment(environmentID)]);
  }

  /* Clone */

  async cloneOne({
    sourceEnvironmentID,
    targetEnvironmentID,
    targetVersionOverride = {},
  }: {
    sourceEnvironmentID: string;
    targetEnvironmentID?: string;
    targetVersionOverride?: Merge<Partial<Omit<VersionJSON, '_id' | 'prototype'>>, { prototype?: any }>;
  }) {
    const [sourceVersion, sourceDiagrams] = await Promise.all([
      this.version.findOneOrFail(sourceEnvironmentID),
      this.diagram.findManyByVersionID(sourceEnvironmentID),

      // clear existing data before cloning
      targetEnvironmentID && this.diagram.deleteManyByVersionID(targetEnvironmentID),
    ]);

    const { version: targetVersion, diagrams: targetDiagrams } = await this.version.importOne({
      sourceVersion: this.version.toJSON(sourceVersion),
      sourceDiagrams: this.diagram.mapToJSON(sourceDiagrams),
      sourceVersionOverride: { ...(targetEnvironmentID && { _id: targetEnvironmentID }), ...targetVersionOverride },
    });

    const cmsCloneManyPayload = {
      sourceAssistantID: sourceVersion.projectID.toJSON(),
      targetAssistantID: targetVersion.projectID.toJSON(),
      sourceEnvironmentID: sourceVersion._id.toJSON(),
      targetEnvironmentID: targetVersion._id.toJSON(),
    };

    const cmsData = await this.postgresEM.transactional(async () => {
      // clear existing data before cloning
      await this.deleteOneCMSData(cmsCloneManyPayload.targetEnvironmentID);

      const { flows } = await this.flow.cloneManyWithSubResourcesForEnvironment(cmsCloneManyPayload);
      const { folders } = await this.folder.cloneManyWithSubResourcesForEnvironment(cmsCloneManyPayload);
      const { variables } = await this.variable.cloneManyWithSubResourcesForEnvironment(cmsCloneManyPayload);
      const { workflows } = await this.workflow.cloneManyWithSubResourcesForEnvironment(cmsCloneManyPayload);
      const { attachments, cardButtons } = await this.attachment.cloneManyWithSubResourcesForEnvironment(cmsCloneManyPayload);
      const { responses, responseVariants, responseAttachments, responseDiscriminators } =
        await this.response.cloneManyWithSubResourcesForEnvironment(cmsCloneManyPayload);
      const { entities, entityVariants } = await this.entity.cloneManyWithSubResourcesForEnvironment(cmsCloneManyPayload);
      const { intents, utterances, requiredEntities } = await this.intent.cloneManyWithSubResourcesForEnvironment(cmsCloneManyPayload);
      const { functions, functionPaths, functionVariables } = await this.functionService.cloneManyWithSubResourcesForEnvironment(cmsCloneManyPayload);

      return {
        flows,
        intents,
        folders,
        entities,
        functions,
        responses,
        variables,
        workflows,
        utterances,
        attachments,
        cardButtons,
        functionPaths,
        entityVariants,
        requiredEntities,
        responseVariants,
        functionVariables,
        responseAttachments,
        responseDiscriminators,
      };
    });

    return {
      ...cmsData,
      version: targetVersion,
      diagrams: targetDiagrams,
      liveDiagramIDs: VersionService.getLiveDiagramIDs(targetVersion, targetDiagrams),
    };
  }

  /* Delete */

  async deleteOne(environmentID: string) {
    await Promise.all([
      this.deleteOneCMSData(environmentID),
      this.version.deleteOne(environmentID),
      this.diagram.deleteManyByVersionID(environmentID),
    ]);
  }

  async getNLUTrainingDiff(environmentID: string) {
    const { prototype: versionPrototype, projectID } = await this.version.findOneOrFailWithFields(environmentID, ['prototype', 'projectID']);
    const { prototype: projectPrototype } = await this.project.findOneOrFailWithFields(projectID, ['prototype']);

    const modelDiff = this.nluTrainingUtil.getModelDiff(projectPrototype?.trainedModel, versionPrototype?.model);
    const { slots, intents } = modelDiff;

    const updatedDeletedSlotsCount = slots.deleted.length + slots.updated.length;
    const updatedDeletedIntentsCount = intents.deleted.length + intents.updated.length;

    const trainedSlotsCount = (projectPrototype?.trainedModel?.slots.length ?? 0) - updatedDeletedSlotsCount;
    const trainedIntentsCount = (projectPrototype?.trainedModel?.intents.length ?? 0) - updatedDeletedIntentsCount;

    const untrainedSlotsCount = slots.new.length + updatedDeletedSlotsCount;
    const untrainedIntentsCount = intents.new.length + updatedDeletedIntentsCount;

    const trainedCount = trainedSlotsCount + trainedIntentsCount;
    const untrainedCount = untrainedSlotsCount + untrainedIntentsCount;

    return {
      hash: this.nluTrainingUtil.getModelDiffHash(modelDiff),
      status: this.nluTrainingUtil.isModelChanged(modelDiff) ? 'untrained' : 'trained',
      data: {
        trainedCount,
        untrainedCount,
        lastTrainedTime: projectPrototype?.lastTrainedTime ?? null,
        trainedSlotsCount,
        trainedIntentsCount,
        untrainedSlotsCount,
        untrainedIntentsCount,
      },
    } as const;
  }
}
