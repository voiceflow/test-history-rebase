/* eslint-disable max-params */
import { EntityManager } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { BaseModels } from '@voiceflow/base-types';
import { AnyResponseVariant, Entity, EntityVariant, Intent, RequiredEntity, Response, ResponseDiscriminator, Utterance } from '@voiceflow/dtos';
import { UnleashFeatureFlagService } from '@voiceflow/nestjs-common';
import {
  AnyResponseVariantEntity,
  DatabaseTarget,
  DiagramEntity,
  EntityEntity,
  EntityVariantEntity,
  IntentEntity,
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
import type { ObjectId } from 'bson';

import { AttachmentService } from '@/attachment/attachment.service';
import { EntitySerializer } from '@/common';
import { DiagramService } from '@/diagram/diagram.service';
import { EntityService } from '@/entity/entity.service';
import { FunctionService } from '@/function/function.service';
import { IntentService } from '@/intent/intent.service';
import { PromptService } from '@/prompt/prompt.service';
import { ResponseService } from '@/response/response.service';
import { StoryService } from '@/story/story.service';
import { VersionService } from '@/version/version.service';

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
    private readonly entitySerializer: EntitySerializer
  ) {}

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

  public async findOneCMSData(assistantID: string, environmentID: string) {
    const [
      { stories, triggers },
      { prompts },
      { entities, entityVariants },
      { intents, utterances, requiredEntities },
      { responses, responseVariants, responseAttachments, responseDiscriminators },
      { attachments, cardButtons },
      { functions, functionPaths, functionVariables },
    ] = await Promise.all([
      this.story.findManyWithSubResourcesByAssistant(assistantID, environmentID),
      this.prompt.findManyWithSubResourcesByAssistant(assistantID, environmentID),
      this.entity.findManyWithSubResourcesByAssistant(assistantID, environmentID),
      this.intent.findManyWithSubResourcesByAssistant(assistantID, environmentID),
      this.response.findManyWithSubResourcesByAssistant(assistantID, environmentID),
      this.attachment.findManyWithSubResourcesByAssistant(assistantID, environmentID),
      this.functionService.findManyWithSubResourcesByAssistant(assistantID, environmentID),
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

  public async upsertCMSData({
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
  }) {
    // ORDER MATTERS

    await this.entity.upsertMany(entities);
    await this.entityVariant.upsertMany(entityVariants);

    await this.response.upsertMany(responses);
    await this.responseDiscriminator.upsertMany(responseDiscriminators);
    await this.responseVariant.upsertMany(responseVariants);

    await this.intent.upsertMany(intents);
    await this.utterance.upsertMany(utterances);
    await this.requiredEntity.upsertMany(requiredEntities);
  }

  async cloneOne({
    cloneDiagrams,
    sourceEnvironmentID,
    targetEnvironmentID,
    targetVersionOverride = {},
  }: {
    cloneDiagrams?: boolean;
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
      assistantID: sourceVersion.projectID.toJSON(),
      sourceEnvironmentID,
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
    cloneDiagrams?: boolean;
    sourceEnvironmentID: string;
    targetEnvironmentID?: string;
    targetVersionOverride?: Partial<Omit<ToJSON<VersionEntity>, 'id' | '_id'>>;
    convertToLegacyFormat?: boolean;
  }) {
    const result = await this.cloneOne({ cloneDiagrams, sourceEnvironmentID, targetEnvironmentID, targetVersionOverride });

    let targetVersion = result.version;

    const targetProject = await this.projectORM.findOneOrFail(targetVersion.projectID);

    if (convertToLegacyFormat && this.unleash.isEnabled(Realtime.FeatureFlag.V2_CMS, { workspaceID: targetProject.teamID })) {
      const { legacySlots, legacyIntents } = this.convertCMSResourcesToLegacyIntentsAndSlots({
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

  async preparePrototype(environmentID: string) {
    let version = await this.version.findOneOrFail(environmentID);
    const [project, diagrams] = await Promise.all([
      this.projectORM.findOneOrFail(version.projectID),
      this.diagram.findManyByVersionID(environmentID),
    ]);

    const [
      { stories, triggers },
      { intents, utterances, requiredEntities },
      { entities, entityVariants },
      { prompts },
      { responses, responseVariants, responseAttachments, responseDiscriminators },
      { attachments, cardButtons },
      { functions, functionPaths, functionVariables },
    ] = await Promise.all([
      this.story.findManyWithSubResourcesByAssistant(project.id, environmentID),
      this.intent.findManyWithSubResourcesByAssistant(project.id, environmentID),
      this.entity.findManyWithSubResourcesByAssistant(project.id, environmentID),
      this.prompt.findManyWithSubResourcesByAssistant(project.id, environmentID),
      this.response.findManyWithSubResourcesByAssistant(project.id, environmentID),
      this.attachment.findManyWithSubResourcesByAssistant(project.id, environmentID),
      this.functionService.findManyWithSubResourcesByAssistant(project.id, environmentID),
    ]);

    if (this.unleash.isEnabled(Realtime.FeatureFlag.V2_CMS, { workspaceID: project.teamID })) {
      const { legacySlots, legacyIntents } = this.convertCMSResourcesToLegacyIntentsAndSlots({
        intents,
        entities,
        // TODO: add variables when they are supported
        variables: [],
        responses,
        utterances,
        entityVariants,
        requiredEntities,
        isVoiceAssistant:
          Realtime.legacyPlatformToProjectType(project.platform, project.type, project.nlu).type === Platform.Constants.ProjectType.VOICE,
        responseVariants,
        responseDiscriminators,
      });

      await this.version.patchOnePlatformData(version.id, { intents: legacyIntents, slots: legacySlots });

      // refetching version to get updated platformData
      version = await this.version.findOneOrFail(version.id);
    }

    return {
      version,
      stories,
      prompts,
      project,
      intents,
      triggers,
      entities,
      diagrams,
      responses,
      functions,
      utterances,
      attachments,
      cardButtons,
      functionPaths,
      liveDiagramIDs: VersionService.getLiveDiagramIDs(version, diagrams),
      entityVariants,
      responseVariants,
      requiredEntities,
      functionVariables,
      responseAttachments,
      responseDiscriminators,
    };
  }

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
}
