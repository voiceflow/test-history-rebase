import { type MikroORM, UseRequestContext } from '@mikro-orm/core';
import { getMikroORMToken } from '@mikro-orm/nestjs';
import { Controller, Inject } from '@nestjs/common';
import { Action, AuthMeta, AuthMetaPayload, Broadcast, Meta } from '@voiceflow/nestjs-logux';
import { DatabaseTarget } from '@voiceflow/orm-designer';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';

import { HashedWorkspaceIDPayload, HashedWorkspaceIDPayloadType } from '@/common';

import { ProjectListService } from './project-list.service';

type AddProjectListRequest = ReturnType<typeof Realtime.projectList.crud.add>['payload'];
type MoveProjectListRequest = ReturnType<typeof Realtime.projectList.crud.move>['payload'];
type PatchProjectListRequest = ReturnType<typeof Realtime.projectList.crud.patch>['payload'];
type RemoveProjectListRequest = ReturnType<typeof Realtime.projectList.crud.remove>['payload'];

@Controller()
export class ProjectListLoguxController {
  constructor(
    @Inject(getMikroORMToken(DatabaseTarget.POSTGRES))
    private readonly orm: MikroORM,
    @Inject(ProjectListService)
    private readonly service: ProjectListService
  ) {}

  @Action(Realtime.projectList.crud.add)
  @Authorize.Permissions([Permission.WORKSPACE_PROJECT_CREATE])
  @Broadcast<AddProjectListRequest>((payload) => ({ channel: Realtime.Channels.workspace.build(payload) }))
  @UseRequestContext()
  public async add(@HashedWorkspaceIDPayload() { key, value, workspaceID }: HashedWorkspaceIDPayloadType<AddProjectListRequest>) {
    await this.service.addOneList(workspaceID, Realtime.Adapters.projectListAdapter.toDB({ ...value, id: key }));
  }

  @Action(Realtime.projectList.crud.patch)
  @Authorize.Permissions<PatchProjectListRequest>([Permission.WORKSPACE_PROJECT_CREATE], ({ workspaceID }) => ({
    id: workspaceID,
    kind: 'workspace',
  }))
  @Broadcast<PatchProjectListRequest>((payload) => ({ channel: Realtime.Channels.workspace.build(payload) }))
  @UseRequestContext()
  public async patch(@HashedWorkspaceIDPayload() { key, value, workspaceID }: HashedWorkspaceIDPayloadType<PatchProjectListRequest>) {
    await this.service.patchOneList(workspaceID, key, value);
  }

  @Action(Realtime.projectList.crud.move)
  @Authorize.Permissions<MoveProjectListRequest>([Permission.WORKSPACE_PROJECT_CREATE], ({ workspaceID }) => ({
    id: workspaceID,
    kind: 'workspace',
  }))
  @Broadcast<MoveProjectListRequest>((payload) => ({ channel: Realtime.Channels.workspace.build(payload) }))
  @UseRequestContext()
  public async move(
    @HashedWorkspaceIDPayload() { workspaceID, fromID, toIndex }: HashedWorkspaceIDPayloadType<MoveProjectListRequest>,
    @Meta() meta?: { skipPersist?: boolean }
  ) {
    if (meta?.skipPersist) return;

    await this.service.moveLists(workspaceID, fromID, toIndex);
  }

  @Action(Realtime.projectList.crud.remove)
  @Authorize.Permissions<RemoveProjectListRequest>([Permission.WORKSPACE_PROJECT_CREATE], ({ workspaceID }) => ({
    id: workspaceID,
    kind: 'workspace',
  }))
  @Broadcast<RemoveProjectListRequest>((payload) => ({ channel: Realtime.Channels.workspace.build(payload) }))
  @UseRequestContext()
  public async remove(
    @HashedWorkspaceIDPayload() { workspaceID, key }: HashedWorkspaceIDPayloadType<RemoveProjectListRequest>,
    @AuthMeta() authMeta: AuthMetaPayload
  ) {
    await this.service.removeList(authMeta, workspaceID, key);
  }

  @Action(Realtime.projectList.addProjectToList)
  @Authorize.Permissions<Realtime.projectList.AddProjectToListPayload>([Permission.WORKSPACE_PROJECT_CREATE], ({ workspaceID }) => ({
    id: workspaceID,
    kind: 'workspace',
  }))
  @Broadcast<Realtime.projectList.AddProjectToListPayload>((payload) => ({ channel: Realtime.Channels.workspace.build(payload) }))
  @UseRequestContext()
  public async addProjectToList(
    @HashedWorkspaceIDPayload() { workspaceID, listID, projectID }: HashedWorkspaceIDPayloadType<Realtime.projectList.AddProjectToListPayload>
  ) {
    await this.service.addProjectToList(workspaceID, listID, projectID);
  }

  @Action(Realtime.projectList.removeProjectFromList)
  @Authorize.Permissions<Realtime.projectList.BaseProjectListPayload>([Permission.PROJECT_DELETE], ({ projectID }) => ({
    id: projectID,
    kind: 'project',
  }))
  @Broadcast<Realtime.projectList.BaseProjectListPayload>((payload) => ({ channel: Realtime.Channels.workspace.build(payload) }))
  @UseRequestContext()
  public async removeProjectFromList(
    @HashedWorkspaceIDPayload() { workspaceID, listID, projectID }: HashedWorkspaceIDPayloadType<Realtime.projectList.BaseProjectListPayload>,
    @AuthMeta() authMeta: AuthMetaPayload
  ) {
    await this.service.removeProjectFromList(authMeta, workspaceID, listID, projectID);
  }

  @Action(Realtime.projectList.transplantProjectBetweenLists)
  @Authorize.Permissions<Realtime.projectList.TransplantProjectBetweenListsPayload>([Permission.WORKSPACE_PROJECT_CREATE], ({ workspaceID }) => ({
    id: workspaceID,
    kind: 'workspace',
  }))
  @Broadcast<Realtime.projectList.TransplantProjectBetweenListsPayload>((payload) => ({ channel: Realtime.Channels.workspace.build(payload) }))
  @UseRequestContext()
  public async transplantProjectBetweenLists(
    @HashedWorkspaceIDPayload() { workspaceID, from, to }: HashedWorkspaceIDPayloadType<Realtime.projectList.TransplantProjectBetweenListsPayload>,
    @Meta() meta?: { skipPersist?: boolean }
  ) {
    if (meta?.skipPersist) return;

    await this.service.transplantProjectBetweenLists(workspaceID, from, to);
  }
}
