/* eslint-disable max-params */
import { EntityManager } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { UnleashFeatureFlagService } from '@voiceflow/nestjs-common';
import {
  AnyResponseVariantEntity,
  DatabaseTarget,
  DiagramEntity,
  EntityEntity,
  EntityVariantEntity,
  IntentEntity,
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
import { EntityService } from '@/entity/entity.service';
import { FunctionService } from '@/function/function.service';
import { IntentService } from '@/intent/intent.service';
import { ProjectService } from '@/project/project.service';
import { PromptService } from '@/prompt/prompt.service';
import { ResponseService } from '@/response/response.service';
import { StoryService } from '@/story/story.service';
import { VersionService } from '@/version/version.service';

@Injectable()
export class EnvironmentService {
  constructor(
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
    @Inject(ProjectService)
    private readonly project: ProjectService,
    @Inject(VersionService)
    private readonly version: VersionService,
    @Inject(ResponseService)
    private readonly response: ResponseService,
    @Inject(AttachmentService)
    private readonly attachment: AttachmentService,
    @Inject(FunctionService)
    private readonly functionService: FunctionService,
    @Inject(UnleashFeatureFlagService)
    private readonly unleashFeatureFlag: UnleashFeatureFlagService,
    @Inject(EntitySerializer)
    private readonly entitySerializer: EntitySerializer
  ) {}

  private convertCMSResourcesToLegacyFormat({
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
    convertToLegacyFormat,
  }: {
    cloneDiagrams?: boolean;
    sourceEnvironmentID: string;
    targetEnvironmentID?: string;
    targetVersionOverride?: Partial<Omit<ToJSON<VersionEntity>, 'id' | '_id'>>;
    convertToLegacyFormat?: boolean;
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

      targetDiagrams = await this.diagram.findManyByVersionID(targetVersion.id);
    }

    const targetProject = await this.project.findOneOrFail(targetVersion.projectID);

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

    if (convertToLegacyFormat && this.unleashFeatureFlag.isEnabled(Realtime.FeatureFlag.V2_CMS, { workspaceID: targetProject.teamID })) {
      const { legacySlots, legacyIntents } = this.convertCMSResourcesToLegacyFormat({
        intents,
        entities,
        // TODO: add variables when they are supported
        variables: [],
        responses,
        utterances,
        entityVariants,
        requiredEntities,
        isVoiceAssistant:
          Realtime.legacyPlatformToProjectType(targetProject.platform, targetProject.type, targetProject.nlu).type ===
          Platform.Constants.ProjectType.VOICE,
        responseVariants,
        responseDiscriminators,
      });

      await this.version.patchOnePlatformData(targetVersion.id, { intents: legacyIntents, slots: legacySlots });

      // refetching version to get updated platformData
      targetVersion = await this.version.findOneOrFail(targetVersion.id);
    }

    return {
      project: targetProject,
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

  async preparePrototype(environmentID: string) {
    let version = await this.version.findOneOrFail(environmentID);
    const [project, diagrams] = await Promise.all([this.project.findOneOrFail(version.projectID), this.diagram.findManyByVersionID(environmentID)]);

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

    if (this.unleashFeatureFlag.isEnabled(Realtime.FeatureFlag.V2_CMS, { workspaceID: project.teamID })) {
      const { legacySlots, legacyIntents } = this.convertCMSResourcesToLegacyFormat({
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
}
