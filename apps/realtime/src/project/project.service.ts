import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { Assistant } from '@voiceflow/dtos';
import { HashedIDService, UnleashFeatureFlagService } from '@voiceflow/nestjs-common';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import { ObjectId, OmitCollections, ProjectEntity, ProjectJSONAdapter, ProjectORM, ToForeignKeys, ToJSON } from '@voiceflow/orm-designer';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { IdentityClient } from '@voiceflow/sdk-identity';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { AssistantService } from '@/assistant/assistant.service';
import { MutableService } from '@/common';
import { ProjectListService } from '@/project-list/project-list.service';
import { deepSetCreatorID } from '@/utils/creator.util';
import { deepSetNewDate } from '@/utils/date.util';
import { VariableStateService } from '@/variable-state/variable-state.service';
import { VersionService } from '@/version/version.service';

import { CreateProjectData } from './dtos/create-project-data.dto';
import { ProjectImportJSONRequest } from './dtos/project-import-json.request';
import { LegacyProjectSerializer } from './project-legacy/legacy-project.serializer';
import { ProjectMemberService } from './project-member/project-member.service';
import { ProjectPlatformService } from './project-platform/project-platform.service';

@Injectable()
export class ProjectService extends MutableService<ProjectORM> {
  // eslint-disable-next-line max-params
  constructor(
    @Inject(ProjectORM)
    protected readonly orm: ProjectORM,
    @Inject(IdentityClient)
    private readonly identityClient: IdentityClient,
    @Inject(LoguxService)
    private readonly logux: LoguxService,
    @Inject(VersionService)
    private readonly version: VersionService,
    @Inject(HashedIDService)
    private readonly hashedID: HashedIDService,
    @Inject(AssistantService)
    private readonly assistant: AssistantService,
    @Inject(ProjectMemberService)
    private readonly member: ProjectMemberService,
    @Inject(ProjectListService)
    private readonly projectList: ProjectListService,
    @Inject(ProjectPlatformService)
    private readonly platform: ProjectPlatformService,
    @Inject(UnleashFeatureFlagService)
    private readonly unleash: UnleashFeatureFlagService,
    @Inject(VariableStateService)
    private readonly variableState: VariableStateService,
    @Inject(LegacyProjectSerializer)
    private readonly legacyProjectSerializer: LegacyProjectSerializer
  ) {
    super();
  }

  static cleanupImportData(
    creatorID: number,
    { version, project, diagrams, ...data }: ProjectImportJSONRequest['data'],
    { settingsAiAssist }: { settingsAiAssist: boolean }
  ) {
    const newVersion = { ...version };
    const newProject = Utils.object.omit(ProjectJSONAdapter.fromDB(deepSetCreatorID(deepSetNewDate({ ...new ProjectEntity(project) }), creatorID)), [
      '_id',
      'id',
      'createdAt',
      'liveVersion',
      'prototype',
    ]);

    if (newProject.knowledgeBase?.documents) {
      newProject.knowledgeBase.documents = {};
    }

    if (!settingsAiAssist) {
      newProject.aiAssistSettings = { ...newProject.aiAssistSettings, aiPlayground: false };
    }

    if (newVersion.prototype && Utils.object.isObject(newVersion.prototype) && Utils.object.isObject(newVersion.prototype.settings)) {
      delete newVersion.prototype.settings.variableStateID;
    }

    return {
      ...data,
      project: newProject,
      version: newVersion,
      diagrams: Object.values(diagrams).map((diagram) => ({ ...diagram, diagramID: diagram.diagramID ?? diagram._id })),
    };
  }

  public async importJSON({ data, userID, workspaceID }: { data: ProjectImportJSONRequest['data']; userID: number; workspaceID: number }) {
    const workspaceProperties = await this.identityClient.workspaceProperty
      .findAllPropertiesByWorkspaceID(this.hashedID.encodeWorkspaceID(workspaceID))
      .catch(() => ({ settingsAiAssist: true, settingsDashboardKanban: true }));
    const cleanedData = ProjectService.cleanupImportData(userID, data, workspaceProperties);

    const newProjectID = new ObjectId().toJSON();
    const newVersionID = new ObjectId().toJSON();

    const [variableStates, { version, diagrams }, project] = await Promise.all([
      cleanedData.variableStates?.length ? this.variableState.createMany(cleanedData.variableStates, { flush: false }) : Promise.resolve([]),

      this.version.importOneJSON(
        {
          sourceVersion: cleanedData.version,
          sourceDiagrams: cleanedData.diagrams,
          sourceVersionOverride: { _id: newVersionID, projectID: newProjectID, creatorID: userID },
        },
        { flush: false }
      ),

      this.createOne(
        {
          ...cleanedData.project,
          _id: newProjectID,
          teamID: workspaceID,
          privacy: 'private',
          members: [],
          updatedBy: userID,
          creatorID: userID,
          updatedAt: new Date().toJSON(),
          apiPrivacy: 'private',
          devVersion: newVersionID,
        },
        { flush: false }
      ),
    ]);

    await this.orm.em.flush();

    const assistant = await this.createAssistantIfRequired({
      userID,
      workspaceID,
      projectID: newProjectID,
      projectName: project.name,
      environmentID: newVersionID,
    });

    return {
      project,
      assistant,
      version,
      diagrams,
      variableStates,
      workspaceProperties,
    };
  }

  public async importJSONAndBroadcast({
    data,
    clientID,
    userID,
    workspaceID,
  }: {
    data: ProjectImportJSONRequest['data'];
    clientID?: string;
    userID: number;
    workspaceID: number;
  }) {
    const hashedWorkspaceID = this.hashedID.encodeWorkspaceID(workspaceID);

    const { project, workspaceProperties } = await this.importJSON({ data, userID, workspaceID });

    if (!clientID) {
      return project;
    }

    const authMeta = { userID, clientID };

    await this.logux.processAs(
      Realtime.project.crud.add({ key: project.id, value: this.legacyProjectSerializer.nullable(project), workspaceID: hashedWorkspaceID }),
      authMeta
    );

    // do nothing if the workspace is using the new dashboard
    if (!workspaceProperties.settingsDashboardKanban) {
      return project;
    }

    let defaultList = await this.projectList.getDefaultList(workspaceID);

    if (!defaultList) {
      defaultList = { name: Realtime.DEFAULT_PROJECT_LIST_NAME, projects: [], board_id: Utils.id.cuid() };

      await this.logux.processAs(
        Realtime.projectList.crud.add({
          key: defaultList.board_id,
          value: { id: defaultList.board_id, ...defaultList },
          workspaceID: hashedWorkspaceID,
        }),
        authMeta
      );
    }

    await this.logux.processAs(
      Realtime.projectList.addProjectToList({ projectID: project.id, listID: defaultList.board_id, workspaceID: hashedWorkspaceID }),
      authMeta
    );

    return project;
  }

  private async createFromTemplate({
    userID,
    workspaceID,
    templateID,
    data,
  }: {
    userID: number;
    workspaceID: number;
    templateID: string;
    data: CreateProjectData;
  }): Promise<Realtime.DBProject> {
    const { platform } = Realtime.legacyPlatformToProjectType(data.platform);
    const client = await this.platform.getClient(platform).getByUserID(userID);

    return client.duplicate(templateID, { ...data, teamID: this.hashedID.encodeWorkspaceID(workspaceID) });
  }

  private async createAssistantIfRequired({
    userID,
    workspaceID,
    projectID,
    projectName,
    environmentID,
  }: {
    userID: number;
    workspaceID: number;
    projectID: string;
    projectName: string;
    environmentID?: string;
  }): Promise<Assistant | null> {
    if (!this.unleash.isEnabled(Realtime.FeatureFlag.V2_CMS, { userID, workspaceID })) return null;

    if (!environmentID) {
      throw new Error('devVersion (environmentID) is missing');
    }

    return this.assistant.createOneForLegacyProject(this.hashedID.encodeWorkspaceID(workspaceID), projectID, {
      name: projectName,
      activePersonaID: null,
      activeEnvironmentID: environmentID,
    });
  }

  public async createAndBroadcast(
    authMeta: AuthMetaPayload,
    {
      workspaceID,
      templateID,
      data,
      ...options
    }: {
      workspaceID: number;
      templateID: string;
      data: CreateProjectData;
      members?: Realtime.ProjectMember[];
      listID?: string;
    }
  ) {
    const encodedWorkspaceID = this.hashedID.encodeWorkspaceID(workspaceID);
    const [listID, dbProject] = await Promise.all([
      this.projectList.acquireDefaultListIDAndBroadcast(authMeta, workspaceID, options.listID),
      this.createFromTemplate({ userID: authMeta.userID, workspaceID, templateID, data }),
    ]);

    let members: Realtime.ProjectMember[] = [];

    try {
      if (options.members?.length) {
        await this.member.addMany(dbProject._id, options.members);

        members = options.members;
      }
    } catch {
      // the add members call is not critical, so we can ignore any errors
      // usually this happens when the editor seats limit is reached
    }

    const assistant = await this.createAssistantIfRequired({
      userID: authMeta.userID,
      workspaceID,
      projectID: dbProject._id,
      projectName: dbProject.name,
      environmentID: dbProject.devVersion,
    });

    const project = Realtime.Adapters.projectAdapter.fromDB(dbProject, { members });

    await Promise.all([
      ...(assistant ? [this.logux.processAs(Actions.Assistant.Add({ data: assistant, context: { workspaceID: dbProject.teamID } }), authMeta)] : []),

      this.logux.processAs(
        Realtime.project.crud.add({
          key: project.id,
          value: project,
          workspaceID: encodedWorkspaceID,
        }),
        authMeta
      ),

      this.logux.processAs(Realtime.projectList.addProjectToList({ workspaceID: encodedWorkspaceID, projectID: project.id, listID }), authMeta),
    ]);

    return project;
  }

  public async patch(projectID: string, data: Partial<Omit<ToJSON<ToForeignKeys<OmitCollections<ProjectEntity>>>, 'updatedAt'>>): Promise<void> {
    return this.orm.patchOne(projectID, data);
  }

  public async patchPlatformData(projectID: string, data: Partial<Pick<ProjectEntity, 'platformData'>>): Promise<void> {
    return this.orm.patchOne(projectID, data);
  }

  public async delete(projectID: string): Promise<void> {
    return this.orm.deleteOne(projectID);
  }
}
