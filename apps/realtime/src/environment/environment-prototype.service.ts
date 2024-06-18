/* eslint-disable max-params */
import { EntityManager } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { DatabaseTarget } from '@voiceflow/orm-designer';
import * as Platform from '@voiceflow/platform-config/backend';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { DiagramService } from '@/diagram/diagram.service';
import { EntityService } from '@/entity/entity.service';
import { IntentService } from '@/intent/intent.service';
import { ProjectService } from '@/project/project.service';
import { ResponseService } from '@/response/response.service';
import { VariableService } from '@/variable/variable.service';
import { VersionService } from '@/version/version.service';

import { CMSResources, PrototypeData } from './environment.interface';
import { EnvironmentRepository } from './environment.repository';
import { ProgramResourcesBuilder } from './program-resources.builder';

@Injectable()
export class EnvironmentPrototypeService {
  constructor(
    @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
    private readonly postgresEM: EntityManager,
    @Inject(VersionService)
    private readonly version: VersionService,
    @Inject(ProjectService)
    private readonly project: ProjectService,
    @Inject(DiagramService)
    private readonly diagram: DiagramService,
    @Inject(IntentService)
    private readonly intent: IntentService,
    @Inject(VariableService)
    private readonly variable: VariableService,
    @Inject(ResponseService)
    private readonly response: ResponseService,
    @Inject(EntityService)
    private readonly entity: EntityService,
    @Inject(EnvironmentRepository)
    private readonly repository: EnvironmentRepository
  ) {}

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
  }: CMSResources) {
    const { entities: entitiesJSON, entityVariants: entityVariantsJSON } = this.entity.toJSONWithSubResources({
      entities,
      entityVariants,
    });
    const { variables: variablesJSON } = this.variable.toJSONWithSubResources({ variables });

    const legacySlots = Realtime.Adapters.entityToLegacySlot.mapFromDB({
      entities: entitiesJSON,
      entityVariants: entityVariantsJSON,
    });

    const { intents: legacyIntents } = Realtime.Adapters.intentToLegacyIntent.mapFromDB(
      {
        ...this.intent.toJSONWithSubResources({ intents, utterances, requiredEntities }),
        ...this.response.toJSONWithSubResources({
          responses,
          responseVariants,
          responseAttachments: [],
          responseDiscriminators,
        }),
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

  async preparePrototype(environmentID: string): Promise<PrototypeData> {
    let version = await this.version.findOneOrFail(environmentID);

    const [project, diagrams, cmsData] = await Promise.all([
      this.project.findOneOrFail(version.projectID),
      this.diagram.findManyByVersionID(environmentID),
      // using transaction to optimize connections
      this.postgresEM.transactional(() => this.repository.findOneCMSData(environmentID)),
    ]);

    const { legacySlots, legacyIntents, legacyVariables } = this.convertCMSResourcesToLegacyResources({
      ...cmsData,
      isVoiceAssistant:
        Realtime.legacyPlatformToProjectType(project.platform, project.type, project.nlu).type ===
        Platform.Constants.ProjectType.VOICE,
    });

    await Promise.all([
      this.version.patchOnePlatformData(environmentID, { intents: legacyIntents, slots: legacySlots }),
      this.version.patchOne(environmentID, {
        variables: Utils.array.unique([...version.variables, ...legacyVariables]),
      }),
    ]);

    // fetching version to get updated platformData
    version = await this.version.findOneOrFail(environmentID);

    const programResources = new ProgramResourcesBuilder()
      .addResponses(cmsData.responses)
      .addDiscriminators(cmsData.responseDiscriminators)
      .addMessages(cmsData.responseMessages)
      .build();

    return {
      ...cmsData,
      version,
      programResources,
      project,
      diagrams,
      liveDiagramIDs: VersionService.getLiveDiagramIDs(version, diagrams),
    };
  }
}
