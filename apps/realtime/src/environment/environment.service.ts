/* eslint-disable max-params */
import { EntityManager } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable, Optional } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import {
  AnyAttachment,
  AnyResponseAttachment,
  AnyResponseVariant,
  AnyTrigger,
  CardButton,
  Entity,
  EntityVariant,
  Function as FunctionType,
  FunctionPath,
  FunctionVariable,
  Intent,
  Prompt,
  RequiredEntity,
  Response,
  ResponseDiscriminator,
  Story,
  Utterance,
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
import { FunctionService } from '@/function/function.service';
import { IntentService } from '@/intent/intent.service';
import { PromptService } from '@/prompt/prompt.service';
import { ResponseService } from '@/response/response.service';
import { StoryService } from '@/story/story.service';
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
    @Inject(StoryService)
    private readonly story: StoryService,
    @Inject(IntentService)
    private readonly intent: IntentService,
    @Inject(EntityService)
    private readonly entity: EntityService,
    @Inject(PromptService)
    private readonly prompt: PromptService,
    @Inject(DiagramService)
    private readonly diagram: DiagramService,
    @Inject(UnleashFeatureFlagService)
    private readonly unleash: UnleashFeatureFlagService,
    @Inject(VersionService)
    private readonly version: VersionService,
    @Inject(ResponseService)
    private readonly response: ResponseService,
    @Inject(AttachmentService)
    private readonly attachment: AttachmentService,
    @Inject(FunctionService)
    private readonly functionService: FunctionService,
    @Inject(EntitySerializer)
    private readonly entitySerializer: EntitySerializer,
    @Optional()
    private readonly diagramUtil: DiagramUtil = new DiagramUtil()
  ) {}

  /* Helpers */

  private convertCMSResourcesToLegacyIntentsAndSlots({
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

    return {
      legacySlots,
      legacyIntents,
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
    const projectID = await this.version.findProjectID(environmentID);

    const [project, diagrams, cmsData] = await Promise.all([
      this.projectORM.findOneOrFail(projectID),
      this.diagram.findManyByVersionID(environmentID),
      this.findOneCMSData(projectID.toHexString(), environmentID),
    ]);

    const { legacyIntents, legacySlots } = this.convertCMSResourcesToLegacyIntentsAndSlots({
      ...cmsData,
      // TODO: add variables when they are supported
      variables: [],
      isVoiceAssistant:
        Realtime.legacyPlatformToProjectType(project.platform, project.type, project.nlu).type === Platform.Constants.ProjectType.VOICE,
    });

    await this.version.patchOnePlatformData(environmentID, { intents: legacyIntents, slots: legacySlots });

    // refetching version to get updated platformData
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
    }: { userID: number; backup?: boolean; workspaceID: number; assistantID: string; environmentID: string }
  ) {
    const createdAt = new Date().toJSON();

    const version = {
      ...data.version,
      updatedAt: backup ? data.version.updatedAt ?? new ObjectId(data.version._id).getTimestamp().toJSON() : createdAt,
    };

    if (version.prototype && Utils.object.isObject(version.prototype) && Utils.object.isObject(version.prototype.settings)) {
      delete version.prototype.settings.variableStateID;
    }

    const cmsData = this.prepareImportCMSData(data, { userID, backup, assistantID, workspaceID, environmentID });

    return {
      ...data,
      ...cmsData,
      version,
      diagrams: Object.values(data.diagrams).map((diagram) => ({ ...diagram, diagramID: diagram.diagramID ?? diagram._id })),
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

  public prepareExportData(
    data: {
      cms: EnvironmentCMSEntities | null;
      version: VersionEntity;
      diagrams: DiagramEntity[];
    },
    { userID, workspaceID, centerDiagrams = true }: { userID: number; workspaceID: number; centerDiagrams?: boolean }
  ): EnvironmentExportImportDTO {
    const version = this.entitySerializer.serialize(data.version);
    const diagrams = this.entitySerializer
      .iterable(data.diagrams)
      .map((diagram) => this.diagramUtil.cleanupNodes(centerDiagrams ? this.diagramUtil.center(diagram) : diagram));

    // Remove stored `variableStateID` to avoid referencing the state from another user
    if (version.prototype && Utils.object.isObject(version.prototype) && Utils.object.isObject(version.prototype.settings)) {
      delete version.prototype.settings.variableStateID;
    }

    const v2CMSEnabled = this.unleash.isEnabled(Realtime.FeatureFlag.V2_CMS, { userID, workspaceID });
    const cmsFunctionsEnabled = this.unleash.isEnabled(Realtime.FeatureFlag.CMS_FUNCTIONS, { userID, workspaceID });

    return {
      version,
      diagrams: Object.fromEntries(diagrams.map((diagram) => [diagram.diagramID, diagram])),

      ...(v2CMSEnabled &&
        data.cms && {
          ...this.entity.prepareExportData(data.cms),
          ...this.intent.prepareExportData(data.cms),
          ...this.response.prepareExportData(data.cms),
          ...this.attachment.prepareExportData(data.cms),
        }),

      ...(cmsFunctionsEnabled && data.cms && this.functionService.prepareExportData(data.cms)),
    };
  }

  public async exportJSON({ userID, workspaceID, environmentID }: { userID: number; workspaceID: number; environmentID: string }) {
    const { version, diagrams } = await this.version.exportOne(environmentID);

    const cmsData = await (this.unleash.isEnabled(Realtime.FeatureFlag.V2_CMS, { userID, workspaceID })
      ? this.findOneCMSData(version.projectID.toJSON(), environmentID)
      : null);

    return {
      cms: cmsData,
      version,
      diagrams,
    };
  }

  /* CMS data  */

  prepareExportCMSData(cms: EnvironmentCMSEntities, { userID, workspaceID }: { userID: number; workspaceID: number }) {
    const v2CMSEnabled = this.unleash.isEnabled(Realtime.FeatureFlag.V2_CMS, { userID, workspaceID });
    const cmsFunctionsEnabled = this.unleash.isEnabled(Realtime.FeatureFlag.CMS_FUNCTIONS, { userID, workspaceID });

    return {
      ...(v2CMSEnabled && {
        ...this.entity.prepareExportData(cms),
        ...this.intent.prepareExportData(cms),
        ...this.response.prepareExportData(cms),
        ...this.attachment.prepareExportData(cms),
      }),

      ...(cmsFunctionsEnabled && this.functionService.prepareExportData(cms)),
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
  ): EnvironmentCMSExportImportDataDTO {
    const v2CMSEnabled = this.unleash.isEnabled(Realtime.FeatureFlag.V2_CMS, { userID, workspaceID });
    const cmsFunctionsEnabled = this.unleash.isEnabled(Realtime.FeatureFlag.CMS_FUNCTIONS, { userID, workspaceID });

    const prepareDataContext = { userID, backup, assistantID, environmentID };

    return {
      ...(v2CMSEnabled && {
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
      }),

      ...(cmsFunctionsEnabled &&
        cms.functions &&
        cms.functionPaths &&
        cms.functionVariables &&
        this.functionService.prepareImportData(
          { functions: cms.functions, functionPaths: cms.functionPaths, functionVariables: cms.functionVariables },
          prepareDataContext
        )),
    };
  }

  async importCMSData(importData: Partial<EnvironmentCMSExportImportDataDTO>) {
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
            this.intent.importManyWithSubResources({
              intents: importData.intents,
              utterances: importData.utterances ?? [],
              requiredEntities: importData.requiredEntities ?? [],
            }),
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
    ]);

    await this.postgresEM.flush();
  }

  async findOneCMSData(assistantID: string, environmentID: string) {
    const [
      { stories, triggers },
      { prompts },
      { entities, entityVariants },
      { intents, utterances, requiredEntities },
      { responses, responseVariants, responseAttachments, responseDiscriminators },
      { attachments, cardButtons },
      { functions, functionPaths, functionVariables },
    ] = await Promise.all([
      this.story.findManyWithSubResourcesByEnvironment(assistantID, environmentID),
      this.prompt.findManyWithSubResourcesByEnvironment(assistantID, environmentID),
      this.entity.findManyWithSubResourcesByEnvironment(assistantID, environmentID),
      this.intent.findManyWithSubResourcesByEnvironment(assistantID, environmentID),
      this.response.findManyWithSubResourcesByEnvironment(assistantID, environmentID),
      this.attachment.findManyWithSubResourcesByEnvironment(assistantID, environmentID),
      this.functionService.findManyWithSubResourcesByEnvironment(assistantID, environmentID),
    ]);

    return {
      stories,
      intents,
      prompts,
      entities,
      triggers,
      functions,
      responses,
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

  async upsertCMSData({
    stories = [],
    intents = [],
    prompts = [],
    triggers = [],
    entities = [],
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
    stories?: Story[];
    intents?: Intent[];
    prompts?: Prompt[];
    triggers?: AnyTrigger[];
    entities?: Entity[];
    functions?: FunctionType[];
    responses?: Response[];
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
  }) {
    // ORDER MATTERS
    await this.attachment.upsertManyWithSubResources({ attachments, cardButtons });
    await this.entity.upsertManyWithSubResources({ entities, entityVariants });
    await this.response.upsertManyWithSubResources({ responses, responseVariants, responseAttachments, responseDiscriminators });
    await this.intent.upsertManyWithSubResources({ intents, utterances, requiredEntities });
    await this.story.upsertManyWithSubResources({ stories, triggers });
    await this.prompt.upsertManyWithSubResources({ prompts });
    await this.functionService.upsertManyWithSubResources({ functions, functionPaths, functionVariables });
  }

  async deleteOneCMSData(assistantID: string, environmentID: string) {
    // needs to be done in multiple operations to avoid locks in reference tables

    // ORDER MATTERS
    await Promise.all([
      this.story.deleteManyByEnvironment(assistantID, environmentID),
      this.functionService.deleteManyByEnvironment(assistantID, environmentID),
      this.intent.deleteManyByEnvironment(assistantID, environmentID),
    ]);

    await Promise.all([
      this.entity.deleteManyByEnvironment(assistantID, environmentID),
      this.response.deleteManyByEnvironment(assistantID, environmentID),
    ]);

    await Promise.all([
      this.prompt.deleteManyByEnvironment(assistantID, environmentID),
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

    let targetVersion = targetEnvironmentID ? await this.version.findOne(targetEnvironmentID) : null;
    let targetDiagrams: DiagramEntity[];

    if (!targetVersion) {
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
      await this.version.patchOne(targetVersion, targetVersionOverride, { flush: false });

      [targetVersion, targetDiagrams] = await Promise.all([
        this.version.findOneOrFail(targetVersion._id),
        this.diagram.findManyByVersionID(targetVersion.id),
      ]);
    }

    const cmsCloneManyPayload = {
      sourceAssistantID: sourceVersion.projectID.toJSON(),
      targetAssistantID: targetVersion.projectID.toJSON(),
      sourceEnvironmentID: sourceVersion.id,
      targetEnvironmentID: targetVersion.id,
    };

    const [
      { stories, triggers },
      { attachments, cardButtons },
      { prompts },
      { responses, responseVariants, responseAttachments, responseDiscriminators },
      { entities, entityVariants },
      { intents, utterances, requiredEntities },
      { functions, functionPaths, functionVariables },
    ] = await Promise.all([
      this.story.cloneManyWithSubResourcesForEnvironment(cmsCloneManyPayload, { flush: false }),
      this.attachment.cloneManyWithSubResourcesForEnvironment(cmsCloneManyPayload, { flush: false }),
      this.prompt.cloneManyWithSubResourcesForEnvironment(cmsCloneManyPayload, { flush: false }),
      this.response.cloneManyWithSubResourcesForEnvironment(cmsCloneManyPayload, { flush: false }),
      this.entity.cloneManyWithSubResourcesForEnvironment(cmsCloneManyPayload, { flush: false }),
      this.intent.cloneManyWithSubResourcesForEnvironment(cmsCloneManyPayload, { flush: false }),
      this.functionService.cloneManyWithSubResourcesForEnvironment(cmsCloneManyPayload, { flush: false }),
    ]);

    // flashing mongo first to be sure that all mongo entities are created before flushing postgres
    await this.mongoEM.flush();
    await this.postgresEM.flush();

    return {
      version: targetVersion,
      stories,
      prompts,
      intents,
      triggers,
      entities,
      diagrams: targetDiagrams,
      functions,
      responses,
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
    const result = await this.cloneOne({ cloneDiagrams, sourceEnvironmentID, targetEnvironmentID, targetVersionOverride });

    let targetVersion = result.version;

    const targetProject = await this.projectORM.findOneOrFail(targetVersion.projectID);

    if (convertToLegacyFormat && this.unleash.isEnabled(Realtime.FeatureFlag.V2_CMS, { workspaceID: targetProject.teamID })) {
      const { legacyIntents, legacySlots } = this.convertCMSResourcesToLegacyIntentsAndSlots({
        ...result,
        // TODO: add variables when they are supported
        variables: [],
        isVoiceAssistant:
          Realtime.legacyPlatformToProjectType(targetProject.platform, targetProject.type, targetProject.nlu).type ===
          Platform.Constants.ProjectType.VOICE,
      });

      await this.version.patchOnePlatformData(targetVersion.id, { intents: legacyIntents, slots: legacySlots });

      // refetching version to get updated platformData
      targetVersion = await this.version.findOneOrFail(targetVersion.id);
    }

    return {
      ...result,
      project: targetProject,
      version: targetVersion,
      liveDiagramIDs: VersionService.getLiveDiagramIDs(targetVersion, result.diagrams),
    };
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
