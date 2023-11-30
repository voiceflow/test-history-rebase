/* eslint-disable max-params */
import { EntityManager } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { BaseModels } from '@voiceflow/base-types';
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
import { EntityVariantService } from '@/entity/entity-variant/entity-variant.service';
import { FunctionService } from '@/function/function.service';
import { IntentService } from '@/intent/intent.service';
import { RequiredEntityService } from '@/intent/required-entity/required-entity.service';
import { UtteranceService } from '@/intent/utterance/utterance.service';
import { PromptService } from '@/prompt/prompt.service';
import { ResponseService } from '@/response/response.service';
import { ResponseDiscriminatorService } from '@/response/response-discriminator/response-discriminator.service';
import { ResponseVariantService } from '@/response/response-variant/response-variant.service';
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
    @Inject(UtteranceService)
    private readonly utterance: UtteranceService,
    @Inject(AttachmentService)
    private readonly attachment: AttachmentService,
    @Inject(EntityVariantService)
    private readonly entityVariant: EntityVariantService,
    @Inject(RequiredEntityService)
    private readonly requiredEntity: RequiredEntityService,
    @Inject(ResponseVariantService)
    private readonly responseVariant: ResponseVariantService,
    @Inject(FunctionService)
    private readonly functionService: FunctionService,
    @Inject(ResponseDiscriminatorService)
    private readonly responseDiscriminator: ResponseDiscriminatorService,
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
          sourceVersion,
          sourceDiagrams,
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
      { intents, utterances, requiredEntities },
      { entities, entityVariants },
      { prompts },
      { responses, responseVariants, responseAttachments, responseDiscriminators },
      { attachments, cardButtons },
      { functions, functionPaths, functionVariables },
    ] = await Promise.all([
      this.story.cloneManyWithSubResourcesForEnvironment(cmsCloneManyPayload, { flush: false }),
      this.intent.cloneManyWithSubResourcesForEnvironment(cmsCloneManyPayload, { flush: false }),
      this.entity.cloneManyWithSubResourcesForEnvironment(cmsCloneManyPayload, { flush: false }),
      this.prompt.cloneManyWithSubResourcesForEnvironment(cmsCloneManyPayload, { flush: false }),
      this.response.cloneManyWithSubResourcesForEnvironment(cmsCloneManyPayload, { flush: false }),
      this.attachment.cloneManyWithSubResourcesForEnvironment(cmsCloneManyPayload, { flush: false }),
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

  async convertLegacyIntentsAndSlotsToCMSResources({
    creatorID,
    legacyNotes,
    legacySlots,
    assistantID,
    legacyIntents,
    environmentID,
  }: {
    creatorID: number;
    legacyNotes: BaseModels.AnyNote[];
    legacySlots: BaseModels.Slot[];
    assistantID: string;
    legacyIntents: BaseModels.Intent[];
    environmentID: string;
  }) {
    const { entities, entityVariants } = Realtime.Adapters.entityToLegacySlot.mapToDB(legacySlots, { creatorID, assistantID, environmentID });
    const { intents, responses, utterances, responseVariants, requiredEntities, responseDiscriminators } =
      Realtime.Adapters.intentToLegacyIntent.mapToDB({ notes: legacyNotes, intents: legacyIntents }, { creatorID, assistantID, environmentID });

    await Promise.all([
      this.entity.createMany(entities, { flush: false }),
      this.entityVariant.createMany(entityVariants, { flush: false }),

      this.intent.createMany(intents, { flush: false }),
      this.utterance.createMany(utterances, { flush: false }),
      this.requiredEntity.createMany(requiredEntities, { flush: false }),

      this.response.createMany(responses, { flush: false }),
      this.responseDiscriminator.createMany(responseDiscriminators, { flush: false }),
      this.responseVariant.createMany(responseVariants, { flush: false }),
    ]);

    await this.postgresEM.flush();
  }

  async findManyForAssistantID(assistantID: string) {
    const project = await this.projectORM.findOneOrFail(assistantID, { fields: ['liveVersion', 'devVersion'] });

    const environmentTags: { tag: string; environmentID: ObjectId }[] = [];

    if (project.liveVersion) environmentTags.push({ tag: 'production', environmentID: project.liveVersion });
    if (project.devVersion) environmentTags.push({ tag: 'development', environmentID: project.devVersion });

    const environmentRefs = await Promise.all(
      environmentTags.map(async ({ tag, environmentID }) => {
        const environment = await this.version.orm.findOne(environmentID, { fields: ['id', 'name', 'creatorID', 'updatedAt'] });

        if (tag === 'development' && environment && project.updatedAt) {
          environment.updatedAt = project.updatedAt;
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
