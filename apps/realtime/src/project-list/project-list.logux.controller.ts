import { Controller, Inject } from '@nestjs/common';
import { Action, AuthMeta, AuthMetaPayload, Broadcast, Meta, Payload } from '@voiceflow/nestjs-logux';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';

import { ProjectListService } from './project-list.service';

type AddProjectListRequest = ReturnType<typeof Realtime.projectList.crud.add>['payload'];
type PatchProjectListRequest = ReturnType<typeof Realtime.projectList.crud.patch>['payload'];
type MoveProjectListRequest = ReturnType<typeof Realtime.projectList.crud.move>['payload'];
type RemoveProjectListRequest = ReturnType<typeof Realtime.projectList.crud.remove>['payload'];

@Controller()
export class ProjectListLoguxController {
  constructor(@Inject(ProjectListService) private readonly service: ProjectListService) {}

  @Action(Realtime.projectList.crud.add)
  @Authorize.Permissions([Permission.WORKSPACE_READ])
  @Broadcast<AddProjectListRequest>((payload) => ({ channel: Realtime.Channels.workspace.build(payload) }))
  public async add(@Payload() { workspaceID, key, value }: AddProjectListRequest, @AuthMeta() authMeta: AuthMetaPayload) {
    await this.service.add(authMeta.userID, workspaceID, Realtime.Adapters.projectListAdapter.toDB({ ...value, id: key }));
  }

  @Action(Realtime.projectList.crud.patch)
  @Authorize.Permissions<PatchProjectListRequest>([Permission.WORKSPACE_READ], ({ workspaceID }) => ({ id: workspaceID, kind: 'workspace' }))
  @Broadcast<PatchProjectListRequest>((payload) => ({ channel: Realtime.Channels.workspace.build(payload) }))
  public async patch(@Payload() { workspaceID, key, value }: PatchProjectListRequest, @AuthMeta() authMeta: AuthMetaPayload) {
    await this.service.patch(authMeta.userID, workspaceID, key, value);
  }

  @Action(Realtime.projectList.crud.move)
  @Authorize.Permissions<MoveProjectListRequest>([Permission.WORKSPACE_READ], ({ workspaceID }) => ({ id: workspaceID, kind: 'workspace' }))
  @Broadcast<MoveProjectListRequest>((payload) => ({ channel: Realtime.Channels.workspace.build(payload) }))
  public async move(
    @Payload() { workspaceID, fromID, toIndex }: MoveProjectListRequest,
    @AuthMeta() authMeta: AuthMetaPayload,
    @Meta() meta?: { skipPersist?: boolean }
  ) {
    if (meta?.skipPersist) return;

    await this.service.move(authMeta.userID, workspaceID, fromID, toIndex);
  }

  @Action(Realtime.projectList.crud.remove)
  @Authorize.Permissions<RemoveProjectListRequest>([Permission.WORKSPACE_READ], ({ workspaceID }) => ({ id: workspaceID, kind: 'workspace' }))
  @Broadcast<RemoveProjectListRequest>((payload) => ({ channel: Realtime.Channels.workspace.build(payload) }))
  public async remove(@Payload() { workspaceID, key }: RemoveProjectListRequest, @AuthMeta() authMeta: AuthMetaPayload) {
    await this.service.remove(authMeta, workspaceID, key);
  }

  @Action(Realtime.projectList.addProjectToList)
  @Authorize.Permissions<Realtime.projectList.AddProjectToListPayload>([Permission.WORKSPACE_READ], ({ workspaceID }) => ({
    id: workspaceID,
    kind: 'workspace',
  }))
  @Broadcast<Realtime.projectList.AddProjectToListPayload>((payload) => ({ channel: Realtime.Channels.workspace.build(payload) }))
  public async addProjectToList(
    @Payload() { workspaceID, listID, projectID }: Realtime.projectList.AddProjectToListPayload,
    @AuthMeta() authMeta: AuthMetaPayload
  ) {
    await this.service.addProjectToList(authMeta.userID, workspaceID, listID, projectID);
  }

  @Action(Realtime.projectList.removeProjectFromList)
  @Authorize.Permissions<Realtime.projectList.BaseProjectListPayload>([Permission.WORKSPACE_READ], ({ workspaceID }) => ({
    id: workspaceID,
    kind: 'workspace',
  }))
  @Broadcast<Realtime.projectList.BaseProjectListPayload>((payload) => ({ channel: Realtime.Channels.workspace.build(payload) }))
  public async removeProjectFromList(
    @Payload() { workspaceID, listID, projectID }: Realtime.projectList.BaseProjectListPayload,
    @AuthMeta() authMeta: AuthMetaPayload
  ) {
    await this.service.removeProjectFromList(authMeta, workspaceID, listID, projectID);
  }

  @Action(Realtime.projectList.transplantProjectBetweenLists)
  @Authorize.Permissions<Realtime.projectList.TransplantProjectBetweenListsPayload>([Permission.WORKSPACE_READ], ({ workspaceID }) => ({
    id: workspaceID,
    kind: 'workspace',
  }))
  @Broadcast<Realtime.projectList.TransplantProjectBetweenListsPayload>((payload) => ({ channel: Realtime.Channels.workspace.build(payload) }))
  public async transplantProjectBetweenLists(
    @Payload() { workspaceID, from, to }: Realtime.projectList.TransplantProjectBetweenListsPayload,
    @AuthMeta() authMeta: AuthMetaPayload,
    @Meta() meta?: { skipPersist?: boolean }
  ) {
    if (meta?.skipPersist) return;

    await this.service.transplantProjectBetweenLists(authMeta.userID, workspaceID, from, to);
  }
}
