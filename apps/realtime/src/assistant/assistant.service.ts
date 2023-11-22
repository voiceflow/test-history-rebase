/* eslint-disable max-params */
import { EntityManager as MongoEntityManager } from '@mikro-orm/mongodb';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable, Optional } from '@nestjs/common';
import { BaseModels } from '@voiceflow/base-types';
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

import { AttachmentService } from '@/attachment/attachment.service';
import { EntitySerializer, MutableService } from '@/common';
import { CreateOneData } from '@/common/types';
import { DiagramUtil } from '@/diagram/diagram.util';
import { EntityService } from '@/entity/entity.service';
import { EnvironmentService } from '@/environment/environment.service';
import { FunctionService } from '@/function/function.service';
import { IntentService } from '@/intent/intent.service';
import { LATEST_PROJECT_VERSION } from '@/project/project.constant';
import { ProjectSerializer } from '@/project/project.serializer';
import { ProjectService } from '@/project/project.service';
import { LegacyProjectSerializer } from '@/project/project-legacy/legacy-project.serializer';
import { ProjectListService } from '@/project-list/project-list.service';
import { PromptService } from '@/prompt/prompt.service';
import { ResponseService } from '@/response/response.service';
import { StoryService } from '@/story/story.service';
import { deepSetCreatorID } from '@/utils/creator.util';
import { deepSetNewDate } from '@/utils/date.util';
import { VariableStateService } from '@/variable-state/variable-state.service';
import { VersionIDAlias } from '@/version/version.constant';
import { VersionService } from '@/version/version.service';

import { AssistantSerializer } from './assistant.serializer';
import { AssistantExportJSONResponse } from './dtos/assistant-export-json.response';
import { AssistantImportJSONRequest } from './dtos/assistant-import-json.request';
import { AssistantImportJSONData } from './dtos/assistant-import-json-data.dto';

@Injectable()
export class AssistantService extends MutableService<AssistantORM> {
  constructor(
    @Inject(AssistantORM)
    protected readonly orm: AssistantORM,
    @Inject(ProgramORM)
    protected readonly programORM: ProgramORM,
    @Inject(ProjectTemplateORM)
    protected readonly projectTemplateORM: ProjectTemplateORM,
    @Inject(PrototypeProgramORM)
    protected readonly prototypeProgramORM: PrototypeProgramORM,
    @Inject(getEntityManagerToken(DatabaseTarget.MONGO))
    protected readonly mongoEntityManager: MongoEntityManager,
    @Inject(IdentityClient)
    private readonly identityClient: IdentityClient,
    @Inject(LoguxService)
    private readonly logux: LoguxService,
    @Inject(StoryService)
    private readonly story: StoryService,
    @Inject(IntentService)
    private readonly intent: IntentService,
    @Inject(EntityService)
    private readonly entity: EntityService,
    @Inject(PromptService)
    private readonly prompt: PromptService,
    @Inject(ProjectService)
    private readonly project: ProjectService,
    @Inject(UnleashFeatureFlagService)
    private readonly unleash: UnleashFeatureFlagService,
    @Inject(VersionService)
    private readonly version: VersionService,
    @Inject(ResponseService)
    private readonly response: ResponseService,
    @Inject(AttachmentService)
    private readonly attachment: AttachmentService,
    @Inject(EnvironmentService)
    private readonly environment: EnvironmentService,
    @Inject(ProjectListService)
    private readonly projectList: ProjectListService,
    @Inject(VariableStateService)
    private readonly variableState: VariableStateService,
    @Inject(FunctionService)
    private readonly functionService: FunctionService,
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

  private prepareImportData(data: AssistantImportJSONData, { userID, settingsAiAssist }: { userID: number; settingsAiAssist: boolean }) {
    const version = { ...data.version };

    const projectEntity = new ProjectEntity({ ...data.project, teamID: NaN });
    const project = Utils.object.omit(ProjectJSONAdapter.fromDB(deepSetCreatorID(deepSetNewDate({ ...projectEntity }), userID)), [
      '_id',
      'teamID',
      'createdAt',
      'prototype',
      'liveVersion',
    ]);

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
    };
  }

  private prepareExportData(
    data: {
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
    };
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

  public async importJSON({ data, userID, workspaceID }: { data: AssistantImportJSONRequest['data']; userID: number; workspaceID: number }) {
    const workspaceProperties = await this.fetchWorkspacePropertiesWithDefaults(workspaceID);

    const importData = this.prepareImportData(data, { userID, settingsAiAssist: workspaceProperties.settingsAiAssist });

    const assistantID = new ObjectId().toJSON();
    const environmentID = new ObjectId().toJSON();

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
          _id: assistantID,
          teamID: workspaceID,
          privacy: 'private',
          members: [],
          updatedBy: userID,
          creatorID: userID,
          updatedAt: new Date().toJSON(),
          apiPrivacy: 'private',
          devVersion: environmentID,
        },
        { flush: false }
      ),
    ]);

    await this.mongoEntityManager.flush();

    // to avoid double transformation we should convert legacy data only for versions migrated to V2 CMS and above
    const shouldConvertLegacyIntentsAndSlots =
      version._version >= Realtime.V2_CMS_SCHEME_VERSION && this.unleash.isEnabled(Realtime.FeatureFlag.V2_CMS, { userID, workspaceID });

    const [{ projectList, projectListCreated }, assistant] = await Promise.all([
      this.addOneToProjectListIfRequired({
        workspaceID,
        assistantID,
        workspaceProperties,
      }),
      this.createOneForProjectIfRequired({
        userID,
        projectID: assistantID,
        workspaceID,
        projectName: project.name,
        environmentID,
      }),
      ...(shouldConvertLegacyIntentsAndSlots
        ? [
            this.environment.convertLegacyIntentsAndSlotsToCMSResources({
              creatorID: userID,
              legacyNotes: Object.values(version.notes ?? {}).filter(
                (note): note is BaseModels.IntentNote => note.type === BaseModels.NoteType.INTENT
              ),
              legacySlots: version.platformData.slots,
              assistantID,
              legacyIntents: version.platformData.intents,
              environmentID,
            }),
          ]
        : []),
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
    data: AssistantImportJSONData;
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

  public async exportJSON({
    assistantID,
    environmentID,
    centerDiagrams,
    programs: withPrograms,
    prototypePrograms: withPrototypePrograms,
  }: {
    programs?: boolean;
    assistantID?: string;
    environmentID: string;
    centerDiagrams?: boolean;
    prototypePrograms?: boolean;
  }) {
    const resolvedEnvironmentID = await this.resolveEnvironmentIDAlias(environmentID, assistantID);
    const { version, diagrams } = await this.version.exportOne(resolvedEnvironmentID);

    const [project, variableStates] = await Promise.all([
      this.project.findOneOrFail(version.projectID.toJSON()),
      this.variableState.findManyByProject(version.projectID.toJSON()),
    ]);

    const programIDs = diagrams.map((diagram) => ({ diagramID: diagram.diagramID.toJSON(), versionID: version.id }));

    const programs = withPrograms ? await this.programORM.findMany(programIDs) : [];
    const prototypePrograms = withPrograms ? await this.prototypeProgramORM.findMany(programIDs) : [];

    return this.prepareExportData(
      {
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
    const templateProject = await this.projectTemplateORM.findOneByPlatformAndTag(templatePlatform, templateTag);

    if (!templateProject) {
      throw new BadRequestException(`Couldn't find a template with tag '${templateTag}' for platform '${templatePlatform}'.`);
    }

    const { project, assistant, ...cmsData } = await this.cloneOne({
      userID,
      targetWorkspaceID,
      sourceAssistantID: templateProject.projectID.toJSON(),
      targetProjectListID,
      targetProjectOverride,
    });

    if (projectMembers?.length) {
      await this.identityClient.private.addManyProjectMembersToProject(project.id, {
        members: projectMembers.map(({ role, creatorID }) => ({ role, userID: creatorID })),
        inviterUserID: userID,
      });
    }

    return { ...cmsData, project, assistant };
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
    const { project, assistant, projectList, projectListCreated, ...cmsData } = await this.createOneFromTemplate({ ...payload, userID });

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
}
