/* eslint-disable max-params */
import fs from 'node:fs/promises';

import { EntityManager } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { ProjectUserRole } from '@voiceflow/dtos';
import { BadRequestException, InternalServerErrorException } from '@voiceflow/exception';
import { UnleashFeatureFlagService } from '@voiceflow/nestjs-common';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import type { PKOrEntity, WorkspaceStubEntity } from '@voiceflow/orm-designer';
import {
  AssistantEntity,
  AssistantORM,
  DatabaseTarget,
  DiagramEntity,
  ObjectId,
  ProgramEntity,
  ProgramORM,
  ProjectEntity,
  ProjectJSONAdapter,
  ProjectTemplateORM,
  PrototypeProgramEntity,
  PrototypeProgramORM,
  ToJSON,
  VariableStateEntity,
  VersionEntity,
} from '@voiceflow/orm-designer';
import * as Platform from '@voiceflow/platform-config/backend';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { IdentityClient } from '@voiceflow/sdk-identity';
import { Actions } from '@voiceflow/sdk-logux-designer';
import _ from 'lodash';

import { EntitySerializer, MutableService } from '@/common';
import { CreateOneData } from '@/common/types';
import { EnvironmentCMSEntities } from '@/environment/environment.interface';
import { EnvironmentService } from '@/environment/environment.service';
import { LATEST_PROJECT_VERSION } from '@/project/project.constant';
import { ProjectSerializer } from '@/project/project.serializer';
import { ProjectService } from '@/project/project.service';
import { LegacyProjectSerializer } from '@/project/project-legacy/legacy-project.serializer';
import { ProjectListService } from '@/project-list/project-list.service';
import { deepSetCreatorID } from '@/utils/creator.util';
import { deepSetNewDate } from '@/utils/date.util';
import { VariableStateService } from '@/variable-state/variable-state.service';
import { VersionIDAlias } from '@/version/version.constant';
import { VersionService } from '@/version/version.service';

import { CreateFromTemplateData } from './assistant.interface';
import { AssistantSerializer } from './assistant.serializer';
import { AssistantExportImportDataDTO } from './dtos/assistant-export-import-data.dto';

@Injectable()
export class AssistantService extends MutableService<AssistantORM> {
  constructor(
    @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
    private readonly postgresEM: EntityManager,

    @Inject(AssistantORM)
    protected readonly orm: AssistantORM,
    @Inject(ProgramORM)
    private readonly programORM: ProgramORM,
    @Inject(ProjectTemplateORM)
    private readonly projectTemplateORM: ProjectTemplateORM,
    @Inject(PrototypeProgramORM)
    private readonly prototypeProgramORM: PrototypeProgramORM,

    @Inject(IdentityClient)
    private readonly identityClient: IdentityClient,
    @Inject(LoguxService)
    private readonly logux: LoguxService,
    @Inject(ProjectService)
    private readonly project: ProjectService,
    @Inject(UnleashFeatureFlagService)
    private readonly unleash: UnleashFeatureFlagService,
    @Inject(VersionService)
    private readonly version: VersionService,
    @Inject(EnvironmentService)
    private readonly environment: EnvironmentService,
    @Inject(ProjectListService)
    private readonly projectList: ProjectListService,
    @Inject(VariableStateService)
    private readonly variableState: VariableStateService,
    @Inject(EntitySerializer)
    private readonly entitySerializer: EntitySerializer,
    @Inject(ProjectSerializer)
    private readonly projectSerializer: ProjectSerializer,
    @Inject(AssistantSerializer)
    private readonly assistantSerializer: AssistantSerializer,
    @Inject(LegacyProjectSerializer)
    private readonly legacyProjectSerializer: LegacyProjectSerializer
  ) {
    super();
  }

  /* Helpers  */

  private async resolveEnvironmentIDAlias(environmentID: string, assistantID?: string) {
    const VERSION_ID_ALIAS_SET = new Set<string>(Object.values(VersionIDAlias));

    if (!VERSION_ID_ALIAS_SET.has(environmentID)) {
      return environmentID;
    }

    if (!assistantID) {
      throw new BadRequestException(`Could not resolve '${environmentID}' environment alias. The "assistantID" is not provided.`);
    }

    const project = await this.project.findOneOrFail(assistantID);

    const resolvedVersionID = environmentID === VersionIDAlias.PRODUCTION ? project.liveVersion?.toString() : project.devVersion?.toString();

    if (!resolvedVersionID) {
      throw new InternalServerErrorException(`Could not resolve '${environmentID}' environment alias. There is no environment under that alias.`);
    }

    return resolvedVersionID;
  }

  private fetchWorkspacePropertiesWithDefaults(workspaceID: number) {
    return this.identityClient.private
      .findAllPropertiesByWorkspaceID(this.projectSerializer.encodeWorkspaceID(workspaceID))
      .catch(() => ({ settingsAiAssist: true, settingsDashboardKanban: true }));
  }

  private async addOneToProjectListIfRequired({
    workspaceID,
    assistantID,
    projectListID,
    workspaceProperties: workspacePropertiesProp,
  }: {
    workspaceID: number;
    assistantID: string;
    projectListID?: string | null;
    workspaceProperties?: { settingsDashboardKanban: boolean };
  }) {
    const workspaceProperties = workspacePropertiesProp ?? (await this.fetchWorkspacePropertiesWithDefaults(workspaceID));

    let projectList: Realtime.DBProjectList | null = null;
    let projectListCreated = false;

    if (workspaceProperties.settingsDashboardKanban) {
      ({ projectList, projectListCreated } = await this.projectList.acquireList(workspaceID, projectListID));

      projectList = await this.projectList.addProjectToList(workspaceID, projectList.board_id, assistantID);
    }

    return {
      projectList,
      projectListCreated,
    };
  }

  /* Find  */

  public async findManyByWorkspace(workspace: PKOrEntity<WorkspaceStubEntity>) {
    return this.orm.findManyByWorkspace(workspace);
  }

  public async findOneCMSData(assistantID: string, environmentID: string) {
    const [assistant, cmsData] = await Promise.all([this.findOneOrFail(assistantID), this.environment.findOneCMSData(assistantID, environmentID)]);

    return {
      ...cmsData,
      assistant,
    };
  }

  /* Import  */

  prepareImportData(
    data: AssistantExportImportDataDTO,
    {
      userID,
      backup,
      assistantID,
      workspaceID,
      environmentID,
      settingsAiAssist,
    }: { userID: number; backup?: boolean; workspaceID: number; assistantID: string; environmentID: string; settingsAiAssist: boolean }
  ) {
    const createdAt = new Date().toJSON();

    const project = {
      ...Utils.object.omit(deepSetCreatorID(deepSetNewDate(data.project), userID), ['prototype', 'createdAt', 'liveVersion', 'previewVersion']),
      _id: assistantID,
      teamID: workspaceID,
      privacy: 'private' as const,
      members: [],
      updatedBy: userID,
      creatorID: userID,
      updatedAt: createdAt,
      apiPrivacy: 'private' as const,
      devVersion: environmentID,
    };

    if (project.knowledgeBase?.documents) {
      project.knowledgeBase.documents = {};
    }

    if (project.knowledgeBase?.faqSets) {
      project.knowledgeBase.faqSets = {};
    }

    if (project.knowledgeBase?.tags) {
      project.knowledgeBase.tags = {};
    }

    if (!settingsAiAssist) {
      project.aiAssistSettings = { ...project.aiAssistSettings, aiPlayground: false };
    }

    return {
      ...data,
      ...this.environment.prepareImportData(data, { userID, backup, assistantID, workspaceID, environmentID }),
      project,
      variableStates: data.variableStates?.map((variableState) => ({ ...Utils.object.omit(variableState, ['_id']), projectID: assistantID })),
    };
  }

  public async importJSON({
    data,
    userID,
    workspaceID,
    projectListID,
    projectOverride = {},
  }: {
    data: AssistantExportImportDataDTO;
    userID: number;
    workspaceID: number;
    projectListID?: string | null;
    projectOverride?: Partial<Omit<ToJSON<ProjectEntity>, 'id' | '_id' | 'teamID'>>;
  }) {
    const workspaceProperties = await this.fetchWorkspacePropertiesWithDefaults(workspaceID);

    const assistantID = new ObjectId().toJSON();
    const environmentID = new ObjectId().toJSON();

    const importData = this.prepareImportData(data, {
      userID,
      workspaceID,
      assistantID,
      environmentID,
      settingsAiAssist: workspaceProperties.settingsAiAssist,
    });

    const project = await this.project.createOne({ ...importData.project, ...projectOverride });

    const [{ projectList, projectListCreated }, assistant] = await Promise.all([
      this.addOneToProjectListIfRequired({
        workspaceID,
        assistantID,
        projectListID,
        workspaceProperties,
      }),
      this.createOne({
        id: assistantID,
        name: project.name,
        updatedByID: userID,
        workspaceID,
        activePersonaID: null,
        activeEnvironmentID: environmentID,
      }),
    ]);

    const [variableStates, { version, diagrams }] = await Promise.all([
      importData.variableStates?.length ? this.variableState.createMany(importData.variableStates, { flush: false }) : Promise.resolve([]),

      this.environment.importJSON({
        data: importData,
        userID,
        workspaceID,
        assistantID,
        environmentID,
      }),
    ]);

    return {
      project,
      version,
      diagrams,
      assistant,
      projectList,
      variableStates,
      projectListCreated,
    };
  }

  public async broadcastAddOne({
    project,
    authMeta,
    assistant,
    projectList,
    projectMembers = [],
    projectListCreated,
  }: {
    project: ProjectEntity;
    authMeta: AuthMetaPayload;
    assistant: AssistantEntity | null;
    projectList: Realtime.DBProjectList | null;
    projectMembers?: Array<{ role: ProjectUserRole; creatorID: number }>;
    projectListCreated: boolean;
  }) {
    const legacyProject = this.legacyProjectSerializer.serialize(project, projectMembers);

    await Promise.all([
      ...(assistant
        ? [
            this.logux.processAs(
              Actions.Assistant.AddOne({
                data: this.assistantSerializer.nullable(assistant),
                context: { workspaceID: legacyProject.workspaceID, broadcastOnly: true },
              }),
              authMeta
            ),
          ]
        : []),

      this.logux.processAs(
        Realtime.project.crud.add({
          key: legacyProject.id,
          value: legacyProject,
          context: { broadcastOnly: true },
          workspaceID: legacyProject.workspaceID,
        }),
        authMeta
      ),

      ...(projectList
        ? [
            projectListCreated
              ? this.logux.processAs(
                  Realtime.projectList.crud.add({
                    key: projectList.board_id,
                    value: { id: projectList.board_id, ...projectList },
                    context: { broadcastOnly: true },
                    workspaceID: legacyProject.workspaceID,
                  }),
                  authMeta
                )
              : this.logux.processAs(
                  Realtime.projectList.addProjectToList({
                    listID: projectList.board_id,
                    context: { broadcastOnly: true },
                    projectID: legacyProject.id,
                    workspaceID: legacyProject.workspaceID,
                  }),
                  authMeta
                ),
          ]
        : []),
    ]);
  }

  public async importJSONAndBroadcast({
    data,
    userID,
    clientID,
    workspaceID,
  }: {
    data: AssistantExportImportDataDTO;
    userID: number;
    clientID?: string;
    workspaceID: number;
  }) {
    const { project, assistant, projectList, projectListCreated } = await this.importJSON({ data, userID, workspaceID });

    if (!clientID) {
      return { project, assistant };
    }

    await this.broadcastAddOne({
      project,
      authMeta: { userID, clientID },
      assistant,
      projectList,
      projectListCreated,
    });

    return { project, assistant };
  }

  /* Export  */

  private prepareExportData(
    data: {
      cms: EnvironmentCMSEntities;
      project: ProjectEntity;
      version: VersionEntity;
      diagrams: DiagramEntity[];
      programs: ProgramEntity[];
      _version: number;
      variableStates: VariableStateEntity[];
      prototypePrograms: PrototypeProgramEntity[];
    },
    {
      userID,
      withPrograms,
      centerDiagrams = true,
      withPrototypePrograms,
    }: { userID: number; withPrograms?: boolean; centerDiagrams?: boolean; withPrototypePrograms?: boolean }
  ): AssistantExportImportDataDTO {
    const project = this.projectSerializer.serialize(data.project);

    // members and previewVersion are private data
    project.members = [];
    project.previewVersion = undefined;

    return {
      ...this.environment.prepareExportData(data, { userID, workspaceID: data.project.teamID, centerDiagrams }),

      project,
      _version: String(data._version),
      variableStates: this.entitySerializer.iterable(data.variableStates),

      ...(withPrograms && { programs: Object.fromEntries(this.entitySerializer.iterable(data.programs).map((program) => [program.id, program])) }),

      ...(withPrototypePrograms && {
        prototypePrograms: Object.fromEntries(this.entitySerializer.iterable(data.programs).map((program) => [program.id, program])),
      }),
    };
  }

  public async exportJSON({
    userID,
    assistantID,
    environmentID,
    centerDiagrams,
    programs: withPrograms,
    prototypePrograms: withPrototypePrograms,
  }: {
    userID: number;
    programs?: boolean;
    assistantID?: string;
    environmentID: string;
    centerDiagrams?: boolean;
    prototypePrograms?: boolean;
  }) {
    const resolvedEnvironmentID = await this.resolveEnvironmentIDAlias(environmentID, assistantID);
    const { projectID } = await this.version.findOneOrFail(resolvedEnvironmentID);

    const [project, variableStates] = await Promise.all([
      this.project.findOneOrFail(projectID.toJSON()),
      this.variableState.findManyByProject(projectID.toJSON()),
    ]);

    const { cms, version, diagrams } = await this.environment.exportJSON({
      userID,
      workspaceID: project.teamID,
      environmentID: resolvedEnvironmentID,
    });

    const programIDs = diagrams.map((diagram) => ({ diagramID: diagram.diagramID.toJSON(), versionID: version.id }));

    const [programs, prototypePrograms] = await Promise.all([
      withPrograms ? await this.programORM.findMany(programIDs) : Promise.resolve([]),
      withPrototypePrograms ? await this.prototypeProgramORM.findMany(programIDs) : Promise.resolve([]),
    ]);

    return this.prepareExportData(
      {
        cms,
        project,
        version,
        diagrams,
        programs,
        _version: project._version ?? LATEST_PROJECT_VERSION,
        variableStates,
        prototypePrograms,
      },
      { userID, centerDiagrams, withPrograms, withPrototypePrograms }
    );
  }

  /* Create  */

  public async createOneForLegacyProject(workspaceID: string, projectID: string, data: Omit<CreateOneData<AssistantORM>, 'workspaceID'>) {
    const assistant = await this.orm.createOne({ ...data, id: projectID, workspaceID: this.assistantSerializer.decodeWorkspaceID(workspaceID) });

    return this.assistantSerializer.nullable(assistant);
  }

  /* Clone  */

  public async cloneOne({
    userID,
    sourceAssistantID,
    targetAssistantID,
    targetWorkspaceID,
    targetProjectListID,
    targetVersionOverride = {},
    targetProjectOverride = {},
  }: {
    userID: number;
    sourceAssistantID: string;
    targetWorkspaceID: number;
    targetAssistantID?: string;
    targetProjectListID?: string | null;
    targetVersionOverride?: Partial<Omit<ToJSON<VersionEntity>, 'id'>>;
    targetProjectOverride?: Partial<Omit<ToJSON<ProjectEntity>, 'id' | '_id' | 'teamID'>>;
  }) {
    return this.postgresEM.transactional(async () => {
      const sourceProject = await this.project.findOneOrFail(sourceAssistantID);

      if (!sourceProject.devVersion) {
        throw new InternalServerErrorException(`The dev environment id doesn't exist.`);
      }

      const targetProject = targetAssistantID ? await this.version.findOne(targetAssistantID) : null;

      if (targetProject) {
        throw new BadRequestException(`The assistant with ID '${targetAssistantID}' already exists.`);
      }

      const assistantID = targetAssistantID ?? new ObjectId().toJSON();
      const environmentID = targetVersionOverride._id ?? new ObjectId().toJSON();

      const sourceProjectJSON = ProjectJSONAdapter.fromDB(sourceProject);

      const project = await this.project.createOne({
        ...Utils.object.omit(sourceProjectJSON, ['privacy', 'apiPrivacy', 'prototype', 'liveVersion', 'previewVersion']),
        _version: LATEST_PROJECT_VERSION,
        ...targetProjectOverride,
        _id: assistantID,
        teamID: targetWorkspaceID,
        members: [],
        updatedAt: new Date().toJSON(),
        devVersion: environmentID,
        ...((sourceProjectJSON.knowledgeBase || targetProjectOverride?.knowledgeBase) && {
          knowledgeBase: { ...sourceProjectJSON.knowledgeBase, documents: {}, faqSets: {}, tags: {}, ...targetProjectOverride?.knowledgeBase },
        }),
      });

      const assistant = await this.createOne({
        id: assistantID,
        name: project.name,
        updatedByID: userID,
        workspaceID: targetWorkspaceID,
        activePersonaID: null,
        activeEnvironmentID: environmentID,
      });

      const [{ version, diagrams, ...cmsData }, variableStates] = await Promise.all([
        this.environment.cloneOne({
          cloneDiagrams: true,
          sourceEnvironmentID: sourceProject.devVersion.toJSON(),
          targetEnvironmentID: environmentID,
          targetVersionOverride: {
            ...Utils.object.omit(targetVersionOverride, ['_id']),
            name: targetVersionOverride.name ?? 'Initial Version',
            projectID: assistantID,
            creatorID: userID,
          },
        }),
        this.variableState.cloneManyByProject({ sourceProjectID: sourceAssistantID, targetProjectID: assistantID }),
      ]);

      const { projectList, projectListCreated } = await this.addOneToProjectListIfRequired({
        workspaceID: targetWorkspaceID,
        assistantID,
        projectListID: targetProjectListID,
      });

      return { ...cmsData, version, project, diagrams, assistant, projectList, variableStates, projectListCreated };
    });
  }

  public async cloneOneAndBroadcast({
    userID,
    clientID,
    ...payload
  }: {
    userID: number;
    clientID?: string;
    sourceAssistantID: string;
    targetWorkspaceID: number;
    targetAssistantID?: string;
    targetProjectListID?: string;
    targetVersionOverride?: Partial<Omit<ToJSON<VersionEntity>, 'id'>>;
    targetProjectOverride?: Partial<Omit<ToJSON<ProjectEntity>, 'id' | '_id' | 'teamID'>>;
  }) {
    const { project, assistant, projectList, projectListCreated, ...cmsData } = await this.cloneOne({ ...payload, userID });

    if (!clientID) {
      return { ...cmsData, project, assistant };
    }

    await this.broadcastAddOne({
      project,
      authMeta: { userID, clientID },
      assistant,
      projectList,
      projectListCreated,
    });

    return { ...cmsData, project, assistant };
  }

  /* Create  */

  private async findOneTemplateVFFile(templatePlatform: string, templateTag = 'default') {
    try {
      // template name patter is `{platform}_{tag}.template.json`
      const vfFile = await fs.readFile(new URL(`templates/${templatePlatform}_${templateTag}.template.json`, import.meta.url), 'utf8');

      return AssistantExportImportDataDTO.parse(JSON.parse(vfFile));
    } catch {
      throw new BadRequestException(`Couldn't find a template with tag '${templateTag}' for platform '${templatePlatform}'.`);
    }
  }

  public async createOneFromTemplate(
    userID: number,
    {
      nlu,
      modality,
      templateTag: templateTagProp,
      workspaceID,
      projectListID,
      projectLocales,
      projectMembers,
      projectOverride,
    }: CreateFromTemplateData
  ) {
    // eslint-disable-next-line sonarjs/cognitive-complexity
    return this.postgresEM.transactional(async () => {
      let project: ProjectEntity;
      let version: VersionEntity;
      let assistant: AssistantEntity | null;
      let projectList: Realtime.DBProjectList | null;
      let projectListCreated: boolean;

      const platformConfig = Platform.Config.get(modality.platform);
      const projectConfig = Platform.Config.getTypeConfig(modality);
      const defaultTemplateTag = Object.keys(platformConfig.types).length > 1 ? modality.type : 'default';
      const localeDefaultVoice = projectConfig.utils.voice.getLocaleDefault(projectLocales);
      const storeLocalesInPublishing = projectConfig.project.locale.storedIn === 'publishing';

      let templateTag = templateTagProp ?? defaultTemplateTag;

      if (this.unleash.isEnabled(Realtime.FeatureFlag.VFFILE_ASSISTANT_TEMPLATE, { userID, workspaceID })) {
        const nonEnglishLocale = projectLocales
          .map(projectConfig.utils.locale.toVoiceflowLocale)
          .includes(Platform.Voiceflow.Common.Project.Locale.CONFIG.enum.EN_US);

        if (!nonEnglishLocale || nlu) {
          templateTag = `${defaultTemplateTag}:empty`;
        }

        const templateVFFle = await this.findOneTemplateVFFile(modality.platform, templateTag);

        const platformData = templateVFFle.version.platformData as Record<string, any>;

        // update template to store locales and default voice
        platformData.settings = {
          ...platformData.settings,
          ...(localeDefaultVoice && { defaultVoice: localeDefaultVoice }),
          ...(!storeLocalesInPublishing && { locales: projectLocales }),
        };
        platformData.publishing = { ...platformData.publishing, ...(storeLocalesInPublishing && { locales: projectLocales }) };

        ({ project, version, assistant, projectList, projectListCreated } = await this.importJSON({
          data: templateVFFle,
          userID,
          workspaceID,
          projectListID,
          projectOverride,
        }));

        // importing nlu data
        if (nlu) {
          const cmsData = {
            ...Realtime.Adapters.intentToLegacyIntent.mapToDB(
              { intents: nlu.intents, notes: [] },
              {
                creatorID: userID,
                legacySlots: nlu.slots,
                assistantID: project.id,
                environmentID: version.id,
              }
            ),
            ...Realtime.Adapters.entityToLegacySlot.mapToDB(nlu.slots, {
              creatorID: userID,
              assistantID: project.id,
              environmentID: version.id,
            }),
          };

          await this.environment.upsertCMSData(cmsData);

          await this.version.patchOnePlatformData(version.id, {
            slots: _.uniqBy([...version.platformData.slots, ...nlu.slots], (intent) => intent.key),
            intents: _.uniqBy([...version.platformData.intents, ...nlu.intents], (slot) => slot.key),
          });
        }
      } else {
        const templateProject = await this.projectTemplateORM.findOneByPlatformAndTag(modality.platform, templateTag);

        if (!templateProject) {
          throw new BadRequestException(`Couldn't find a template with tag '${templateTag}' for platform '${modality.platform}'.`);
        }

        ({ project, version, assistant, projectList, projectListCreated } = await this.cloneOne({
          userID,
          targetWorkspaceID: workspaceID,
          sourceAssistantID: templateProject.projectID.toJSON(),
          targetProjectListID: projectListID,
          targetProjectOverride: projectOverride,
        }));

        await this.version.patchOnePlatformData(version.id, {
          ...(nlu && {
            slots: _.uniqBy([...version.platformData.slots, ...nlu.slots], (intent) => intent.key),
            intents: _.uniqBy([...version.platformData.intents, ...nlu.intents], (slot) => slot.key),
          }),
          settings: {
            ...version.platformData.settings,
            ...(localeDefaultVoice && { defaultVoice: localeDefaultVoice }),
            ...(!storeLocalesInPublishing && { locales: projectLocales }),
          },
          publishing: {
            ...version.platformData.publishing,
            ...(storeLocalesInPublishing && { locales: projectLocales }),
          },
        });
      }

      if (projectMembers?.length) {
        await this.identityClient.private.addManyProjectMembersToProject(project.id, {
          members: projectMembers.map(({ role, creatorID }) => ({ role, userID: creatorID })),
          inviterUserID: userID,
        });
      }

      return { project, assistant, projectList, projectListCreated };
    });
  }

  public async createOneFromTemplateAndBroadcast({ userID, clientID }: AuthMetaPayload, data: CreateFromTemplateData) {
    const { project, assistant, projectList, projectListCreated } = await this.createOneFromTemplate(userID, data);

    if (!clientID) {
      return { project, assistant };
    }

    await this.broadcastAddOne({
      project,
      authMeta: { userID, clientID },
      assistant,
      projectList,
      projectListCreated,
    });

    return { project, assistant };
  }
}
