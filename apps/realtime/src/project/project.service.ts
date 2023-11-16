import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { HashedIDService } from '@voiceflow/nestjs-common';
import { LoguxService } from '@voiceflow/nestjs-logux';
import {
  EntityCreateParams,
  ObjectId,
  OmitCollections,
  ProjectEntity,
  ProjectJSONAdapter,
  ProjectORM,
  ToForeignKeys,
  ToJSON,
} from '@voiceflow/orm-designer';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { IdentityClient } from '@voiceflow/sdk-identity';

import { MutableService } from '@/common';
import { ProjectListService } from '@/project-list/project-list.service';
import { deepSetCreatorID } from '@/utils/creator.util';
import { deepSetNewDate } from '@/utils/date.util';
import { VariableStateService } from '@/variable-state/variable-state.service';
import { VersionService } from '@/version/version.service';

import { ProjectImportJSONRequest } from './dtos/project-import-json-request.dto';
import { LegacyProjectSerializer } from './project-legacy/legacy-project.serializer';

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
    @Inject(ProjectListService)
    private readonly projectList: ProjectListService,
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

  private async importJSON({
    data,
    creatorID,
    workspaceID,
    workspaceProperties,
  }: {
    data: ProjectImportJSONRequest['data'];
    creatorID: number;
    workspaceID: number;
    workspaceProperties: { settingsAiAssist: boolean };
  }) {
    const cleanedData = ProjectService.cleanupImportData(creatorID, data, workspaceProperties);

    const newProjectID = new ObjectId().toJSON();
    const newVersionID = new ObjectId().toJSON();

    const [variableStates, { version, diagrams }, project] = await Promise.all([
      cleanedData.variableStates?.length ? this.variableState.createMany(cleanedData.variableStates, { flush: false }) : Promise.resolve([]),

      this.version.importOneJSON(
        {
          sourceVersion: cleanedData.version,
          sourceDiagrams: cleanedData.diagrams,
          sourceVersionOverride: { _id: newVersionID, projectID: newProjectID, creatorID },
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
          updatedBy: creatorID,
          creatorID,
          updatedAt: new Date().toJSON(),
          apiPrivacy: 'private',
          devVersion: newVersionID,
        },
        { flush: false }
      ),
    ]);

    await this.orm.em.flush();

    return {
      project,
      version,
      diagrams,
      variableStates,
    };
  }

  public async importJSONAndBroadcast({
    data,
    clientID,
    creatorID,
    workspaceID,
  }: {
    data: ProjectImportJSONRequest['data'];
    clientID?: string;
    creatorID: number;
    workspaceID: number;
  }) {
    const hashedWorkspaceID = this.hashedID.encodeWorkspaceID(workspaceID);

    const workspaceProperties = await this.identityClient.workspaceProperty
      .findAllPropertiesByWorkspaceID(this.hashedID.encodeWorkspaceID(workspaceID))
      .catch(() => ({ settingsAiAssist: true, settingsDashboardKanban: true }));

    const { project } = await this.importJSON({ data, creatorID, workspaceID, workspaceProperties });

    if (!clientID) {
      return project;
    }

    const authMeta = { userID: creatorID, clientID };

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

  public async create(data: EntityCreateParams<ProjectEntity>) {
    return this.orm.createOne(data);
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
