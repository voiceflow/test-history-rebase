/* eslint-disable max-params */
import fs from 'node:fs/promises';

import { EntityManager as MongoEntityManager } from '@mikro-orm/mongodb';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable, Optional } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { Project, ProjectUserRole } from '@voiceflow/dtos';
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
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { IdentityClient } from '@voiceflow/sdk-identity';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { EntitySerializer, MutableService } from '@/common';
import { CreateOneData } from '@/common/types';
import { DiagramUtil } from '@/diagram/diagram.util';
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

import { AssistantSerializer } from './assistant.serializer';
import { AssistantExportJSONResponse } from './dtos/assistant-export-json.response';
import { AssistantImportJSONRequest } from './dtos/assistant-import-json.request';
import { AssistantImportJSONDataDTO } from './dtos/assistant-import-json-data.dto';

@Injectable()
export class AssistantService extends MutableService<AssistantORM> {
  constructor(
    @Inject(AssistantORM)
    protected readonly orm: AssistantORM,
    @Inject(ProgramORM)
    private readonly programORM: ProgramORM,
    @Inject(ProjectTemplateORM)
    private readonly projectTemplateORM: ProjectTemplateORM,
    @Inject(PrototypeProgramORM)
    private readonly prototypeProgramORM: PrototypeProgramORM,
    @Inject(getEntityManagerToken(DatabaseTarget.MONGO))
    private readonly mongoEM: MongoEntityManager,
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
    private readonly legacyProjectSerializer: LegacyProjectSerializer,
    @Optional()
    private readonly diagramUtil: DiagramUtil = new DiagramUtil()
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

  private async createOneForProjectIfRequired({
    userID,
    projectID,
    workspaceID,
    projectName,
    environmentID,
  }: {
    userID: number;
    projectID: string;
    workspaceID: number;
    projectName: string;
    environmentID: string;
  }) {
    if (!this.unleash.isEnabled(Realtime.FeatureFlag.V2_CMS, { userID, workspaceID })) return null;

    return this.createOne({
      id: projectID,
      name: projectName,
      updatedByID: userID,
      workspaceID,
      activePersonaID: null,
      activeEnvironmentID: environmentID,
    });
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
    projectListID?: string;
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

  /* CMS Data  */

  public async findOneCMSData(assistantID: string, environmentID: string) {
    const [assistant, cmsData] = await Promise.all([this.findOneOrFail(assistantID), this.environment.findOneCMSData(assistantID, environmentID)]);

    return {
      ...cmsData,
      assistant,
    };
  }

  /* Import  */

  prepareImportData(
    data: AssistantImportJSONDataDTO,
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

    const version = {
      ...data.version,
      updatedAt: backup ? data.version.updatedAt ?? new ObjectId(data.version._id).getTimestamp().toJSON() : createdAt,
    };

    const project = {
      ...Utils.object.omit(deepSetCreatorID(deepSetNewDate(data.project), userID), ['prototype', 'createdAt', 'liveVersion']),
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

    if (!settingsAiAssist) {
      project.aiAssistSettings = { ...project.aiAssistSettings, aiPlayground: false };
    }

    if (version.prototype && Utils.object.isObject(version.prototype) && Utils.object.isObject(version.prototype.settings)) {
      delete version.prototype.settings.variableStateID;
    }

    return {
      ...data,
      project,
      version,
      diagrams: Object.values(data.diagrams).map((diagram) => ({ ...diagram, diagramID: diagram.diagramID ?? diagram._id })),
      variableStates: data.variableStates?.map((variableState) => ({ ...Utils.object.omit(variableState, ['_id']), projectID: assistantID })),
      ...this.environment.prepareImportCMSData(data, { userID, backup, assistantID, workspaceID, environmentID }),
    };
  }

  async importCMSResources(importData: Omit<AssistantImportJSONDataDTO, 'project' | 'version' | 'diagrams' | 'variableStates'>) {
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

    await this.postgresEntityManager.flush();
  }

  public async importJSON({
    data,
    userID,
    workspaceID,
    projectListID,
    projectOverride = {},
  }: {
    data: AssistantImportJSONRequest['data'];
    userID: number;
    workspaceID: number;
    projectListID?: string;
    projectOverride?: Partial<Omit<ToJSON<ProgramEntity>, 'id' | '_id' | 'teamID'>>;
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

    const [variableStates, { version, diagrams }, project] = await Promise.all([
      importData.variableStates?.length ? this.variableState.createMany(importData.variableStates, { flush: false }) : Promise.resolve([]),

      this.version.importOneJSON(
        {
          sourceVersion: importData.version,
          sourceDiagrams: importData.diagrams,
          sourceVersionOverride: { _id: environmentID, projectID: assistantID, creatorID: userID },
        },
        { flush: false }
      ),

      this.project.createOne(
        {
          ...importData.project,
          ...projectOverride,
        },
        { flush: false }
      ),
    ]);

    await this.mongoEM.flush();

    const [{ projectList, projectListCreated }, assistant] = await Promise.all([
      this.addOneToProjectListIfRequired({
        workspaceID,
        assistantID,
        projectListID,
        workspaceProperties,
      }),
      this.createOneForProjectIfRequired({
        userID,
        projectID: assistantID,
        workspaceID,
        projectName: project.name,
        environmentID,
      }),
    ]);

    await this.environment.importCMSData(importData);

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
    data: AssistantImportJSONDataDTO;
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
      cms: EnvironmentCMSEntities | null;
      userID: number;
      project: ProjectEntity;
      version: VersionEntity;
      diagrams: DiagramEntity[];
      programs: ProgramEntity[];
      _version: number;
      variableStates: VariableStateEntity[];
      prototypePrograms: PrototypeProgramEntity[];
    },
    {
      withPrograms,
      centerDiagrams = true,
      withPrototypePrograms,
    }: { withPrograms?: boolean; centerDiagrams?: boolean; withPrototypePrograms?: boolean } = {}
  ): AssistantExportJSONResponse {
    const version = this.entitySerializer.serialize(data.version);
    const project = this.projectSerializer.serialize(data.project);
    const diagrams = this.entitySerializer
      .iterable(data.diagrams)
      .map((diagram) => this.diagramUtil.cleanupNodes(centerDiagrams ? this.diagramUtil.center(diagram) : diagram));

    // members are private data
    project.members = [];

    // Remove stored `variableStateID` to avoid referencing the state from another user
    if (version.prototype && Utils.object.isObject(version.prototype) && Utils.object.isObject(version.prototype.settings)) {
      delete version.prototype.settings.variableStateID;
    }

    return {
      project,
      version,
      _version: String(data._version),
      diagrams: Object.fromEntries(diagrams.map((diagram) => [diagram.diagramID, diagram])),
      variableStates: this.entitySerializer.iterable(data.variableStates),

      ...(withPrograms && { programs: Object.fromEntries(this.entitySerializer.iterable(data.programs).map((program) => [program.id, program])) }),

      ...(withPrototypePrograms && {
        prototypePrograms: Object.fromEntries(this.entitySerializer.iterable(data.programs).map((program) => [program.id, program])),
      }),

      ...(data.cms && this.environment.prepareExportCMSData(data.cms, { userID: data.userID, workspaceID: data.project.teamID })),
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
    const { version, diagrams } = await this.version.exportOne(resolvedEnvironmentID);

    const projectID = version.projectID.toJSON();

    const [project, variableStates] = await Promise.all([this.project.findOneOrFail(projectID), this.variableState.findManyByProject(projectID)]);

    // TODO: move into Promise.all above when V2_CMS is released
    const cmsData = await (this.unleash.isEnabled(Realtime.FeatureFlag.V2_CMS, { userID, workspaceID: project.teamID })
      ? this.environment.findOneCMSData(projectID, resolvedEnvironmentID)
      : null);

    const programIDs = diagrams.map((diagram) => ({ diagramID: diagram.diagramID.toJSON(), versionID: version.id }));

    const programs = withPrograms ? await this.programORM.findMany(programIDs) : [];
    const prototypePrograms = withPrograms ? await this.prototypeProgramORM.findMany(programIDs) : [];

    return this.prepareExportData(
      {
        cms: cmsData,
        userID,
        project,
        version,
        diagrams,
        programs,
        _version: project._version ?? LATEST_PROJECT_VERSION,
        variableStates,
        prototypePrograms,
      },
      { centerDiagrams, withPrograms, withPrototypePrograms }
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
    targetProjectListID?: string;
    targetVersionOverride?: Partial<Omit<ToJSON<VersionEntity>, 'id'>>;
    targetProjectOverride?: Partial<Omit<ToJSON<ProgramEntity>, 'id' | '_id' | 'teamID'>>;
  }) {
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

    const { version, diagrams, ...cmsData } = await this.environment.cloneOne({
      cloneDiagrams: true,
      sourceEnvironmentID: sourceProject.devVersion.toJSON(),
      targetEnvironmentID: environmentID,
      targetVersionOverride: {
        ...Utils.object.omit(targetVersionOverride, ['_id']),
        name: targetVersionOverride.name ?? 'Initial Version',
        projectID: assistantID,
        creatorID: userID,
      },
    });

    const project = await this.project.createOne({
      ...Utils.object.omit(ProjectJSONAdapter.fromDB(sourceProject), ['privacy', 'apiPrivacy', 'liveVersion']),
      _version: LATEST_PROJECT_VERSION,
      ...targetProjectOverride,
      _id: assistantID,
      teamID: targetWorkspaceID,
      members: [],
      updatedAt: new Date().toJSON(),
      devVersion: environmentID,
    });

    const [{ projectList, projectListCreated }, assistant] = await Promise.all([
      this.addOneToProjectListIfRequired({
        workspaceID: targetWorkspaceID,
        assistantID,
        projectListID: targetProjectListID,
      }),
      this.createOneForProjectIfRequired({
        userID,
        projectID: assistantID,
        workspaceID: targetWorkspaceID,
        projectName: project.name,
        environmentID,
      }),
    ]);

    return { ...cmsData, version, project, diagrams, assistant, projectList, projectListCreated };
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
    targetProjectOverride?: Partial<Omit<ToJSON<ProgramEntity>, 'id' | '_id' | 'teamID'>>;
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

      return AssistantImportJSONDataDTO.parse(JSON.parse(vfFile));
    } catch {
      throw new BadRequestException(`Couldn't find a template with tag '${templateTag}' for platform '${templatePlatform}'.`);
    }
  }

  public async createOneFromTemplate({
    userID,
    templateTag,
    projectMembers,
    templatePlatform,
    targetWorkspaceID,
    targetProjectListID,
    targetProjectOverride,
  }: {
    userID: number;
    templateTag?: string;
    projectMembers?: Array<{ role: ProjectUserRole; creatorID: number }>;
    templatePlatform: string;
    targetWorkspaceID: number;
    targetProjectListID?: string;
    targetProjectOverride?: Omit<Partial<Project>, '_id'>;
  }) {
    let project: ProjectEntity;
    let assistant: AssistantEntity | null;
    let projectList: Realtime.DBProjectList | null;
    let projectListCreated: boolean;

    if (this.unleash.isEnabled(Realtime.FeatureFlag.VFFILE_ASSISTANT_TEMPLATE, { userID, workspaceID: targetWorkspaceID })) {
      const templateVFFle = await this.findOneTemplateVFFile(templatePlatform, templateTag);

      ({ project, assistant, projectList, projectListCreated } = await this.importJSON({
        data: templateVFFle,
        userID,
        workspaceID: targetWorkspaceID,
        projectListID: targetProjectListID,
        projectOverride: targetProjectOverride,
      }));
    } else {
      const templateProject = await this.projectTemplateORM.findOneByPlatformAndTag(templatePlatform, templateTag);

      if (!templateProject) {
        throw new BadRequestException(`Couldn't find a template with tag '${templateTag}' for platform '${templatePlatform}'.`);
      }

      ({ project, assistant, projectList, projectListCreated } = await this.cloneOne({
        userID,
        targetWorkspaceID,
        sourceAssistantID: templateProject.projectID.toJSON(),
        targetProjectListID,
        targetProjectOverride,
      }));
    }

    if (projectMembers?.length) {
      await this.identityClient.private.addManyProjectMembersToProject(project.id, {
        members: projectMembers.map(({ role, creatorID }) => ({ role, userID: creatorID })),
        inviterUserID: userID,
      });
    }

    return { project, assistant, projectList, projectListCreated };
  }

  public async createOneFromTemplateAndBroadcast({
    userID,
    clientID,
    ...payload
  }: {
    userID: number;
    clientID?: string;
    templateTag?: string;
    projectMembers?: Array<{ role: ProjectUserRole; creatorID: number }>;
    templatePlatform: string;
    targetWorkspaceID: number;
    targetProjectListID?: string;
    targetProjectOverride?: Omit<Partial<Project>, '_id'>;
  }) {
    const { project, assistant, projectList, projectListCreated } = await this.createOneFromTemplate({ ...payload, userID });

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
