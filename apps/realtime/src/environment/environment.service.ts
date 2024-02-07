/* eslint-disable max-params */
import { EntityManager } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable, Optional } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import {
  AnyAttachment,
  AnyResponseAttachment,
  AnyResponseVariant,
  CardButton,
  Entity,
  EntityVariant,
  Flow,
  Function as FunctionType,
  FunctionPath,
  FunctionVariable,
  Intent,
  RequiredEntity,
  Response,
  ResponseDiscriminator,
  Utterance,
  Variable,
} from '@voiceflow/dtos';
import { UnleashFeatureFlagService } from '@voiceflow/nestjs-common';
import {
  AnyResponseVariantEntity,
  DatabaseTarget,
  DiagramEntity,
  EntityEntity,
  EntityVariantEntity,
  IntentEntity,
  ObjectId,
  ProjectORM,
  RequiredEntityEntity,
  ResponseDiscriminatorEntity,
  ResponseEntity,
  ToJSON,
  ToJSONWithForeignKeys,
  UtteranceEntity,
  VariableEntity,
  VersionEntity,
} from '@voiceflow/orm-designer';
import * as Platform from '@voiceflow/platform-config/backend';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { AttachmentService } from '@/attachment/attachment.service';
import { EntitySerializer } from '@/common';
import { DiagramService } from '@/diagram/diagram.service';
import { DiagramUtil } from '@/diagram/diagram.util';
import { EntityService } from '@/entity/entity.service';
import { FlowService } from '@/flow/flow.service';
import { FolderService } from '@/folder/folder.service';
import { FunctionService } from '@/function/function.service';
import { IntentService } from '@/intent/intent.service';
import { ResponseService } from '@/response/response.service';
import { VariableService } from '@/variable/variable.service';
import { VersionService } from '@/version/version.service';

import { EnvironmentCMSExportImportDataDTO } from './dtos/environment-cms-export-import-data.dto';
import { EnvironmentExportImportDTO } from './dtos/environment-export-import-data.dto';
import { EnvironmentCMSEntities } from './environment.interface';

@Injectable()
export class EnvironmentService {
  constructor(
    @Inject(ProjectORM)
    private readonly projectORM: ProjectORM,
    @Inject(getEntityManagerToken(DatabaseTarget.MONGO))
    private readonly mongoEM: EntityManager,
    @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
    private readonly postgresEM: EntityManager,
    @Inject(IntentService)
    private readonly intent: IntentService,
    @Inject(EntityService)
    private readonly entity: EntityService,
    @Inject(FolderService)
    private readonly folder: FolderService,
    @Inject(DiagramService)
    private readonly diagram: DiagramService,
    @Inject(UnleashFeatureFlagService)
    private readonly unleash: UnleashFeatureFlagService,
    @Inject(VersionService)
    private readonly version: VersionService,
    @Inject(ResponseService)
    private readonly response: ResponseService,
    @Inject(VariableService)
    private readonly variable: VariableService,
    @Inject(AttachmentService)
    private readonly attachment: AttachmentService,
    @Inject(FunctionService)
    private readonly functionService: FunctionService,
    @Inject(FlowService)
    private readonly flow: FlowService,
    @Inject(EntitySerializer)
    private readonly entitySerializer: EntitySerializer,
    @Optional()
    private readonly diagramUtil: DiagramUtil = new DiagramUtil()
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
    intents: IntentEntity[];
    entities: EntityEntity[];
    responses: ResponseEntity[];
    variables: VariableEntity[];
    utterances: UtteranceEntity[];
    entityVariants: EntityVariantEntity[];
    isVoiceAssistant: boolean;
    requiredEntities: RequiredEntityEntity[];
    responseVariants: AnyResponseVariantEntity[];
    responseDiscriminators: ResponseDiscriminatorEntity[];
  }) {
    const legacySlots = Realtime.Adapters.entityToLegacySlot.mapFromDB({
      entities: this.entitySerializer.iterable(entities),
      entityVariants: this.entitySerializer.iterable(entityVariants),
    });
    const { intents: legacyIntents } = Realtime.Adapters.intentToLegacyIntent.mapFromDB(
      {
        intents: this.entitySerializer.iterable(intents),
        responses: this.entitySerializer.iterable(responses),
        utterances: this.entitySerializer.iterable(utterances),
        requiredEntities: this.entitySerializer.iterable(requiredEntities),
        responseVariants: this.entitySerializer.iterable(responseVariants),
        responseDiscriminators: this.entitySerializer.iterable(responseDiscriminators),
      },
      {
        entities: this.entitySerializer.iterable(entities),
        variables: this.entitySerializer.iterable(variables),
        isVoiceAssistant,
      }
    );
    const legacyVariables = Realtime.Adapters.variableToLegacyVariableAdapter.mapFromDB(this.entitySerializer.iterable(variables));

    return {
      legacySlots,
      legacyIntents,
      legacyVariables,
    };
  }

  /* Find */

  async findManyForAssistantID(assistantID: string) {
    const project = await this.projectORM.findOneOrFail(assistantID, { fields: ['liveVersion', 'devVersion', 'previewVersion'] });

    const environmentTags: { tag: string; environmentID: ObjectId }[] = [];

    if (project.liveVersion) environmentTags.push({ tag: 'production', environmentID: project.liveVersion });
    if (project.devVersion) environmentTags.push({ tag: 'development', environmentID: project.devVersion });
    if (project.previewVersion) environmentTags.push({ tag: 'preview', environmentID: project.previewVersion });

    const environmentRefs = await Promise.all(
      environmentTags.map(async ({ tag, environmentID }) => {
        const environment = await this.version.orm.findOne(environmentID, { fields: ['id', 'name', 'creatorID', 'updatedAt'] });

        if (tag === 'development' && environment) {
          // hard code development environment name
          environment.name = 'Development';
          if (project.updatedAt) environment.updatedAt = project.updatedAt;
        }

        return {
          tag,
          environment,
        };
      })
    );

    return environmentRefs
      .filter(({ environment }) => !!environment)
      .map(({ tag, environment }) => ({ tag, environment: this.entitySerializer.serialize(environment!) }));
  }

  /* Prototype */
  async preparePrototype(environmentID: string) {
    const projectID = await this.version.findOneProjectID(environmentID);

    const [project, diagrams, cmsData] = await Promise.all([
      this.projectORM.findOneOrFail(projectID),
      this.diagram.findManyByVersionID(environmentID),
      // using transaction to optimize connections
      this.postgresEM.transactional(() => this.findOneCMSData(projectID.toHexString(), environmentID)),
    ]);

    const cmsVariablesEnabled = this.unleash.isEnabled(Realtime.FeatureFlag.CMS_VARIABLES, { workspaceID: project.teamID });

    const { legacySlots, legacyIntents, legacyVariables } = this.convertCMSResourcesToLegacyResources({
      ...cmsData,
      isVoiceAssistant:
        Realtime.legacyPlatformToProjectType(project.platform, project.type, project.nlu).type === Platform.Constants.ProjectType.VOICE,
    });

    await Promise.all([
      this.version.patchOnePlatformData(environmentID, { intents: legacyIntents, slots: legacySlots }),
      cmsVariablesEnabled ? this.version.patchOne(environmentID, { variables: legacyVariables }) : Promise.resolve(),
    ]);

    // fetching version to get updated platformData
    const version = await this.version.findOneOrFail(environmentID);

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
    data: EnvironmentExportImportDTO,
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
    };

    if (version.prototype && Utils.object.isObject(version.prototype) && Utils.object.isObject(version.prototype.settings)) {
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

  public prepareExportCMSData(
    data: EnvironmentCMSEntities,
    { userID, backup, workspaceID }: { userID: number; backup?: boolean; workspaceID: number }
  ) {
    const cmsFoldersEnabled = this.unleash.isEnabled(Realtime.FeatureFlag.CMS_FOLDERS, { userID, workspaceID });
    const cmsFunctionsEnabled = this.unleash.isEnabled(Realtime.FeatureFlag.CMS_FUNCTIONS, { userID, workspaceID });
    const cmsVariablesEnabled = this.unleash.isEnabled(Realtime.FeatureFlag.CMS_VARIABLES, { userID, workspaceID });

    return {
      ...this.entity.prepareExportData(data, { backup }),
      ...this.intent.prepareExportData(data, { backup }),
      ...this.response.prepareExportData(data, { backup }),
      ...this.attachment.prepareExportData(data, { backup }),

      ...(cmsFoldersEnabled && this.folder.prepareExportData(data, { backup })),
      ...(cmsVariablesEnabled && this.variable.prepareExportData(data, { backup })),
      ...(cmsFunctionsEnabled && this.functionService.prepareExportData(data, { backup })),
      /* TODO FF */
      ...this.flow.prepareExportData(data, { backup }),
    };
  }

  public prepareExportCMSJSONData(
    data: { [Key in keyof EnvironmentCMSEntities]: ToJSONWithForeignKeys<EnvironmentCMSEntities[Key][number]>[] },
    { userID, workspaceID }: { userID: number; workspaceID: number }
  ) {
    const cmsFoldersEnabled = this.unleash.isEnabled(Realtime.FeatureFlag.CMS_FOLDERS, { userID, workspaceID });
    const cmsFunctionsEnabled = this.unleash.isEnabled(Realtime.FeatureFlag.CMS_FUNCTIONS, { userID, workspaceID });
    const cmsVariablesEnabled = this.unleash.isEnabled(Realtime.FeatureFlag.CMS_VARIABLES, { userID, workspaceID });

    return {
      ...this.entity.prepareExportJSONData(data),
      ...this.intent.prepareExportJSONData(data),
      ...this.response.prepareExportJSONData(data),
      ...this.attachment.prepareExportJSONData(data),

      ...(cmsFoldersEnabled && this.folder.prepareExportJSONData(data)),
      ...(cmsVariablesEnabled && this.variable.prepareExportJSONData(data)),
      ...(cmsFunctionsEnabled && this.functionService.prepareExportJSONData(data)),
    };
  }

  public prepareExportData(
    data: {
      cms: EnvironmentCMSEntities | null;
      version: VersionEntity;
      diagrams: DiagramEntity[];
    },
    { userID, backup, workspaceID, centerDiagrams = true }: { userID: number; backup?: boolean; workspaceID: number; centerDiagrams?: boolean }
  ): EnvironmentExportImportDTO {
    const version = this.entitySerializer.serialize(data.version);
    const diagrams = this.entitySerializer
      .iterable(data.diagrams)
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
    const { version, diagrams } = await this.version.exportOne(environmentID);

    const cmsData = await this.findOneCMSData(version.projectID.toJSON(), environmentID);

    return {
      cms: cmsData,
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
    const cmsFoldersEnabled = this.unleash.isEnabled(Realtime.FeatureFlag.CMS_FOLDERS, { userID, workspaceID });
    const cmsFunctionsEnabled = this.unleash.isEnabled(Realtime.FeatureFlag.CMS_FUNCTIONS, { userID, workspaceID });
    const cmsVariablesEnabled = this.unleash.isEnabled(Realtime.FeatureFlag.CMS_VARIABLES, { userID, workspaceID });

    const prepareDataContext = { userID, backup, assistantID, environmentID };

    return {
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

      ...(cmsVariablesEnabled && cms.variables && this.variable.prepareImportData({ variables: cms.variables }, prepareDataContext)),

      ...(cmsFoldersEnabled && cms.folders && this.folder.prepareImportData({ folders: cms.folders }, prepareDataContext)),
      /* TODO FF */
      ...(cms.flows && this.flow.prepareImportData({ flows: cms.flows }, prepareDataContext)),
    };
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  async importCMSData(importData: ReturnType<EnvironmentService['prepareImportCMSData']>) {
    await Promise.all([
      ...(importData.attachments?.length
        ? [
            this.attachment.importManyWithSubResources(
              {
                attachments: importData.attachments,
                cardButtons: importData.cardButtons ?? [],
              },
              { flush: false }
            ),
          ]
        : []),

      ...(importData.responses?.length
        ? [
            this.response.importManyWithSubResources(
              {
                responses: importData.responses,
                responseVariants: importData.responseVariants ?? [],
                responseAttachments: importData.responseAttachments ?? [],
                responseDiscriminators: importData.responseDiscriminators ?? [],
              },
              { flush: false }
            ),
          ]
        : []),

      ...(importData.entities?.length
        ? [
            this.entity.importManyWithSubResources(
              {
                entities: importData.entities,
                entityVariants: importData.entityVariants ?? [],
              },
              { flush: false }
            ),
          ]
        : []),

      ...(importData.intents?.length
        ? [
            this.intent.importManyWithSubResources(
              {
                intents: importData.intents,
                utterances: importData.utterances ?? [],
                requiredEntities: importData.requiredEntities ?? [],
              },
              { flush: false }
            ),
          ]
        : []),

      ...(importData.functions?.length
        ? [
            this.functionService.importManyWithSubResources(
              {
                functions: importData.functions,
                functionPaths: importData.functionPaths ?? [],
                functionVariables: importData.functionVariables ?? [],
              },
              { flush: false }
            ),
          ]
        : []),

      ...(importData.variables?.length
        ? [
            this.variable.importManyWithSubResources(
              {
                variables: importData.variables,
              },
              { flush: false }
            ),
          ]
        : []),

      ...(importData.folders?.length
        ? [
            this.folder.importManyWithSubResources(
              {
                folders: importData.folders,
              },
              { flush: false }
            ),
          ]
        : []),

      ...(importData.flows?.length
        ? [
            this.flow.importManyWithSubResources(
              {
                flows: importData.flows,
              },
              { flush: false }
            ),
          ]
        : []),
    ]);

    await this.postgresEM.flush();
  }

  async findOneCMSData(assistantID: string, environmentID: string) {
    const [
      { folders },
      { entities, entityVariants },
      { intents, utterances, requiredEntities },
      { flows },
      { variables },
      { responses, responseVariants, responseAttachments, responseDiscriminators },
      { attachments, cardButtons },
      { functions, functionPaths, functionVariables },
    ] = await Promise.all([
      this.folder.findManyWithSubResourcesByEnvironment(assistantID, environmentID),
      this.entity.findManyWithSubResourcesByEnvironment(assistantID, environmentID),
      this.intent.findManyWithSubResourcesByEnvironment(assistantID, environmentID),
      this.flow.findManyWithSubResourcesByEnvironment(assistantID, environmentID),
      this.variable.findManyWithSubResourcesByEnvironment(assistantID, environmentID),
      this.response.findManyWithSubResourcesByEnvironment(assistantID, environmentID),
      this.attachment.findManyWithSubResourcesByEnvironment(assistantID, environmentID),
      this.functionService.findManyWithSubResourcesByEnvironment(assistantID, environmentID),
    ]);

    return {
      folders,
      flows,
      intents,
      entities,
      functions,
      responses,
      variables,
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

  async findOneCMSDataJSON(assistantID: string, environmentID: string) {
    const [
      { entities, entityVariants },
      { intents, utterances, requiredEntities },
      { folders },
      { variables },
      { responses, responseVariants, responseAttachments, responseDiscriminators },
      { attachments, cardButtons },
      { functions, functionPaths, functionVariables },
    ] = await Promise.all([
      this.entity.findManyWithSubResourcesJSONByEnvironment(assistantID, environmentID),
      this.intent.findManyWithSubResourcesJSONByEnvironment(assistantID, environmentID),
      this.folder.findManyWithSubResourcesJSONByEnvironment(assistantID, environmentID),
      this.variable.findManyWithSubResourcesJSONByEnvironment(assistantID, environmentID),
      this.response.findManyWithSubResourcesJSONByEnvironment(assistantID, environmentID),
      this.attachment.findManyWithSubResourcesJSONByEnvironment(assistantID, environmentID),
      this.functionService.findManyWithSubResourcesJSONByEnvironment(assistantID, environmentID),
    ]);

    return {
      folders,
      intents,
      entities,
      functions,
      responses,
      variables,
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

  async upsertCMSData(
    {
      flows = [],
      intents = [],
      entities = [],
      variables = [],
      responses = [],
      functions = [],
      utterances = [],
      attachments = [],
      cardButtons = [],
      functionPaths = [],
      entityVariants = [],
      requiredEntities = [],
      responseVariants = [],
      functionVariables = [],
      responseAttachments = [],
      responseDiscriminators = [],
    }: {
      flows?: Flow[];
      intents?: Intent[];
      entities?: Entity[];
      functions?: FunctionType[];
      responses?: Response[];
      variables?: Variable[];
      utterances?: Utterance[];
      attachments?: AnyAttachment[];
      cardButtons?: CardButton[];
      functionPaths?: FunctionPath[];
      entityVariants?: EntityVariant[];
      requiredEntities?: RequiredEntity[];
      responseVariants?: AnyResponseVariant[];
      functionVariables?: FunctionVariable[];
      responseAttachments?: AnyResponseAttachment[];
      responseDiscriminators?: ResponseDiscriminator[];
    },
    meta: { userID: number; assistantID: string; environmentID: string }
  ) {
    // ORDER MATTERS
    await this.variable.upsertManyWithSubResources({ variables }, meta);
    await this.attachment.upsertManyWithSubResources({ attachments, cardButtons }, meta);
    await this.entity.upsertManyWithSubResources({ entities, entityVariants }, meta);
    await this.response.upsertManyWithSubResources({ responses, responseVariants, responseAttachments, responseDiscriminators }, meta);
    await this.intent.upsertManyWithSubResources({ intents, utterances, requiredEntities }, meta);
    await this.functionService.upsertManyWithSubResources({ functions, functionPaths, functionVariables }, meta);
    await this.flow.upsertManyWithSubResources({ flows }, meta);
  }

  async deleteOneCMSData(assistantID: string, environmentID: string) {
    // needs to be done in multiple operations to avoid locks in reference tables
    await Promise.all([
      this.intent.deleteManyByEnvironment(assistantID, environmentID),
      this.functionService.deleteManyByEnvironment(assistantID, environmentID),
    ]);

    await Promise.all([this.flow.deleteManyByEnvironment(assistantID, environmentID)]);

    await Promise.all([
      this.entity.deleteManyByEnvironment(assistantID, environmentID),
      this.response.deleteManyByEnvironment(assistantID, environmentID),
      this.variable.deleteManyByEnvironment(assistantID, environmentID),
    ]);

    await Promise.all([
      this.folder.deleteManyByEnvironment(assistantID, environmentID),
      this.attachment.deleteManyByEnvironment(assistantID, environmentID),
    ]);
  }

  /* Clone */

  async cloneOne({
    cloneDiagrams,
    sourceEnvironmentID,
    targetEnvironmentID,
    targetVersionOverride = {},
  }: {
    cloneDiagrams: boolean;
    sourceEnvironmentID: string;
    targetEnvironmentID?: string;
    targetVersionOverride?: Partial<Omit<ToJSON<VersionEntity>, 'id' | '_id'>>;
  }) {
    const sourceVersion = await this.version.findOneOrFail(sourceEnvironmentID);
    let targetVersion: VersionEntity;
    let targetDiagrams: DiagramEntity[];

    const targetEnvironmentExists = targetEnvironmentID && (await this.version.exists(targetEnvironmentID));
    if (!targetEnvironmentExists) {
      const sourceDiagrams = await (cloneDiagrams ? this.diagram.findManyByVersionID(sourceEnvironmentID) : Promise.resolve([]));

      ({ version: targetVersion, diagrams: targetDiagrams } = await this.version.importOne(
        {
          sourceVersion: this.entitySerializer.serialize(sourceVersion),
          sourceDiagrams: this.entitySerializer.iterable(sourceDiagrams),
          sourceVersionOverride: { ...(targetEnvironmentID && { _id: targetEnvironmentID }), ...targetVersionOverride },
        },
        { flush: false }
      ));
    } else {
      await this.version.patchOne(targetEnvironmentID, targetVersionOverride, { flush: false });

      [targetVersion, targetDiagrams] = await Promise.all([
        this.version.findOneOrFail(targetEnvironmentID),
        this.diagram.findManyByVersionID(targetEnvironmentID),
      ]);
    }

    const cmsCloneManyPayload = {
      sourceAssistantID: sourceVersion.projectID.toJSON(),
      targetAssistantID: targetVersion.projectID.toJSON(),
      sourceEnvironmentID: sourceVersion.id,
      targetEnvironmentID: targetVersion.id,
    };

    // clear existing data before cloning
    await this.deleteOneCMSData(cmsCloneManyPayload.targetAssistantID, cmsCloneManyPayload.targetEnvironmentID);

    const [
      { folders },
      { flows },
      { variables },
      { attachments, cardButtons },
      { responses, responseVariants, responseAttachments, responseDiscriminators },
      { entities, entityVariants },
      { intents, utterances, requiredEntities },
      { functions, functionPaths, functionVariables },
    ] = await Promise.all([
      this.folder.cloneManyWithSubResourcesForEnvironment(cmsCloneManyPayload, { flush: false }),
      this.flow.cloneManyWithSubResourcesForEnvironment(cmsCloneManyPayload, { flush: false }),
      this.variable.cloneManyWithSubResourcesForEnvironment(cmsCloneManyPayload, { flush: false }),
      this.attachment.cloneManyWithSubResourcesForEnvironment(cmsCloneManyPayload, { flush: false }),
      this.response.cloneManyWithSubResourcesForEnvironment(cmsCloneManyPayload, { flush: false }),
      this.entity.cloneManyWithSubResourcesForEnvironment(cmsCloneManyPayload, { flush: false }),
      this.intent.cloneManyWithSubResourcesForEnvironment(cmsCloneManyPayload, { flush: false }),
      this.functionService.cloneManyWithSubResourcesForEnvironment(cmsCloneManyPayload, { flush: false }),
    ]);

    // flashing mongo first to be sure that all mongo entities are created before flushing postgres
    await this.mongoEM.flush();
    await this.postgresEM.flush();

    return {
      flows,
      version: targetVersion,
      intents,
      folders,
      entities,
      diagrams: targetDiagrams,
      functions,
      responses,
      variables,
      utterances,
      attachments,
      cardButtons,
      functionPaths,
      liveDiagramIDs: VersionService.getLiveDiagramIDs(targetVersion, targetDiagrams),
      entityVariants,
      requiredEntities,
      responseVariants,
      functionVariables,
      responseAttachments,
      responseDiscriminators,
    };
  }

  async cloneOneAndTransform({
    cloneDiagrams,
    sourceEnvironmentID,
    targetEnvironmentID,
    targetVersionOverride = {},
    convertToLegacyFormat,
  }: {
    cloneDiagrams: boolean;
    sourceEnvironmentID: string;
    targetEnvironmentID?: string;
    targetVersionOverride?: Partial<Omit<ToJSON<VersionEntity>, 'id' | '_id'>>;
    convertToLegacyFormat?: boolean;
  }) {
    return this.postgresEM.transactional(async () => {
      const result = await this.cloneOne({ cloneDiagrams, sourceEnvironmentID, targetEnvironmentID, targetVersionOverride });

      let targetVersion = result.version;

      const targetProject = await this.projectORM.findOneOrFail(targetVersion.projectID);

      if (convertToLegacyFormat) {
        const cmsVariablesEnabled = this.unleash.isEnabled(Realtime.FeatureFlag.CMS_VARIABLES, { workspaceID: targetProject.teamID });

        const { legacySlots, legacyIntents, legacyVariables } = this.convertCMSResourcesToLegacyResources({
          ...result,
          isVoiceAssistant:
            Realtime.legacyPlatformToProjectType(targetProject.platform, targetProject.type, targetProject.nlu).type ===
            Platform.Constants.ProjectType.VOICE,
        });

        await Promise.all([
          this.version.patchOnePlatformData(targetVersion.id, { intents: legacyIntents, slots: legacySlots }),
          cmsVariablesEnabled ? this.version.patchOne(targetVersion.id, { variables: legacyVariables }) : Promise.resolve(),
        ]);

        // refetching version to get updated platformData
        targetVersion = await this.version.findOneOrFail(targetVersion.id);
      }

      return {
        ...result,
        project: targetProject,
        version: targetVersion,
        liveDiagramIDs: VersionService.getLiveDiagramIDs(targetVersion, result.diagrams),
      };
    });
  }

  /* Delete */

  async deleteOne(assistantID: string, environmentID: string) {
    await Promise.all([
      this.deleteOneCMSData(assistantID, environmentID),
      this.version.deleteOne(environmentID),
      this.diagram.deleteManyByVersionID(environmentID),
    ]);
  }
}
