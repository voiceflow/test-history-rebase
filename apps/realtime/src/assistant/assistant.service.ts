/* eslint-disable max-params */
import { EntityManager as MongoEntityManager } from '@mikro-orm/mongodb';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable, Optional } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { BadRequestException, InternalServerErrorException } from '@voiceflow/exception';
import { UnleashFeatureFlagService } from '@voiceflow/nestjs-common';
import { LoguxService } from '@voiceflow/nestjs-logux';
import type { PKOrEntity, WorkspaceStubEntity } from '@voiceflow/orm-designer';
import {
  AssistantORM,
  DatabaseTarget,
  DiagramEntity,
  ObjectId,
  ProgramEntity,
  ProgramORM,
  ProjectEntity,
  ProjectJSONAdapter,
  PrototypeProgramEntity,
  PrototypeProgramORM,
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
    environmentID?: string;
  }) {
    if (!this.unleash.isEnabled(Realtime.FeatureFlag.V2_CMS, { userID, workspaceID })) return null;

    if (!environmentID) {
      throw new InternalServerErrorException('devVersion (environmentID) is missing');
    }

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

  private async addOneToDefaultListIfRequired({
    workspaceID,
    assistantID,
    workspaceProperties: workspacePropertiesProp,
  }: {
    workspaceID: number;
    assistantID: string;
    workspaceProperties?: { settingsDashboardKanban: boolean };
  }) {
    const workspaceProperties = workspacePropertiesProp ?? (await this.fetchWorkspacePropertiesWithDefaults(workspaceID));

    let defaultProjectList: Realtime.DBProjectList | null = null;
    let defaultProjectListCreated = false;

    if (workspaceProperties.settingsDashboardKanban) {
      defaultProjectList = await this.projectList.getDefaultList(workspaceID);

      if (!defaultProjectList) {
        defaultProjectList = { name: Realtime.DEFAULT_PROJECT_LIST_NAME, projects: [assistantID], board_id: Utils.id.cuid() };

        await this.projectList.createOne(workspaceID, defaultProjectList);

        defaultProjectListCreated = true;
      } else {
        await this.projectList.addProjectToList(workspaceID, defaultProjectList.board_id, assistantID);
      }
    }

    return {
      defaultProjectList,
      defaultProjectListCreated,
    };
  }

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

    const [{ defaultProjectList, defaultProjectListCreated }, assistant] = await Promise.all([
      this.addOneToDefaultListIfRequired({
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
    ]);

    return {
      project,
      version,
      diagrams,
      assistant,
      variableStates,
      defaultProjectList,
      defaultProjectListCreated,
    };
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
    const { project, assistant, defaultProjectList, defaultProjectListCreated } = await this.importJSON({ data, userID, workspaceID });

    if (!clientID) {
      return { project, assistant };
    }

    const authMeta = { userID, clientID };
    const encodedWorkspaceID = this.projectSerializer.encodeWorkspaceID(workspaceID);

    const serializedProject = this.legacyProjectSerializer.nullable(project);

    await Promise.all([
      this.logux.processAs(Realtime.project.crud.add({ key: project.id, value: serializedProject, workspaceID: encodedWorkspaceID }), authMeta),

      ...(assistant
        ? [
            this.logux.processAs(
              Actions.Assistant.Add({ data: this.assistantSerializer.nullable(assistant), context: { workspaceID: serializedProject.workspaceID } }),
              authMeta
            ),
          ]
        : []),

      ...(defaultProjectList
        ? [
            defaultProjectListCreated
              ? this.logux.processAs(
                  Realtime.projectList.crud.add({
                    key: defaultProjectList.board_id,
                    value: { id: defaultProjectList.board_id, ...defaultProjectList },
                    context: { broadcastOnly: true },
                    workspaceID: encodedWorkspaceID,
                  }),
                  authMeta
                )
              : this.logux.processAs(
                  Realtime.projectList.addProjectToList({
                    listID: defaultProjectList.board_id,
                    context: { broadcastOnly: true },
                    projectID: project.id,
                    workspaceID: encodedWorkspaceID,
                  }),
                  authMeta
                ),
          ]
        : []),
    ]);

    return { project, assistant };
  }

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

  public async createOneForLegacyProject(workspaceID: string, projectID: string, data: Omit<CreateOneData<AssistantORM>, 'workspaceID'>) {
    const assistant = await this.orm.createOne({ ...data, id: projectID, workspaceID: this.assistantSerializer.decodeWorkspaceID(workspaceID) });

    return this.assistantSerializer.nullable(assistant);
  }

  public async findManyByWorkspace(workspace: PKOrEntity<WorkspaceStubEntity>) {
    return this.orm.findManyByWorkspace(workspace);
  }

  public async findOneCMSData(assistantID: string, environmentID: string) {
    const [
      assistant,
      { stories, triggers },
      { prompts },
      { entities, entityVariants },
      { intents, utterances, requiredEntities },
      { responses, responseVariants, responseAttachments, responseDiscriminators },
      { attachments, cardButtons },
      { functions, functionPaths, functionVariables },
    ] = await Promise.all([
      this.findOneOrFail(assistantID),
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
      assistant,
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
}
