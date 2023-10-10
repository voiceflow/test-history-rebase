import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { sanitizePatch } from '@voiceflow/socket-utils';

import { CreatorService } from '@/creator/creator.service';

@Injectable()
export class ProjectListService {
  constructor(
    @Inject(LoguxService)
    private readonly logux: LoguxService,
    @Inject(CreatorService)
    private readonly creator: CreatorService
  ) {}

  private async applyPatch(
    userID: number,
    workspaceID: string,
    listID: string,
    transform: (data: Realtime.ProjectList) => Partial<Realtime.ProjectList>
  ): Promise<void> {
    const projectLists = await this.getAll(userID, workspaceID);

    const patched = projectLists.map((dbList) => {
      if (dbList.board_id !== listID) return dbList;

      const list = Realtime.Adapters.projectListAdapter.fromDB(dbList);

      return Realtime.Adapters.projectListAdapter.toDB({ ...list, ...sanitizePatch(transform(list)) });
    });

    await this.replaceAll(userID, workspaceID, patched);
  }

  public async getAll(userID: number, workspaceID: string): Promise<Realtime.DBProjectList[]> {
    const client = await this.creator.getClientByUserID(userID);

    return client.projectList.getAll(workspaceID);
  }

  public async getDefault(userID: number, workspace: string): Promise<Realtime.DBProjectList | null> {
    const projectLists = await this.getAll(userID, workspace);

    return projectLists.find((list) => list.name === Realtime.DEFAULT_PROJECT_LIST_NAME) ?? null;
  }

  public async replaceAll(userID: number, workspaceID: string, projectLists: Realtime.DBProjectList[]): Promise<void> {
    const client = await this.creator.getClientByUserID(userID);

    return client.projectList.replaceAll(workspaceID, projectLists);
  }

  public async add(userID: number, workspaceID: string, data: Realtime.DBProjectList): Promise<void> {
    const projectLists = await this.getAll(userID, workspaceID);

    await this.replaceAll(userID, workspaceID, [...projectLists, data]);
  }

  public async patch(userID: number, workspaceID: string, listID: string, data: Partial<Realtime.ProjectList>): Promise<void> {
    await this.applyPatch(userID, workspaceID, listID, () => Utils.object.pick(data, ['name']));
  }

  public async move(userID: number, workspaceID: string, fromID: string, toIndex: number): Promise<void> {
    const projectLists = await this.getAll(userID, workspaceID);

    const fromIndex = projectLists.findIndex((list) => list.board_id === fromID);

    if (toIndex === fromIndex) return;

    await this.replaceAll(userID, workspaceID, Utils.array.reorder(projectLists, fromIndex, toIndex));
  }

  public async remove(authMeta: AuthMetaPayload, workspaceID: string, listID: string): Promise<void> {
    const projectLists = await this.getAll(authMeta.userID, workspaceID);

    const targetProjectList = projectLists.find((list) => list.board_id === listID);

    if (!targetProjectList) return;

    await Promise.all([
      this.logux.processAs(Realtime.project.crud.removeMany({ keys: targetProjectList.projects, workspaceID }), authMeta),
      this.replaceAll(authMeta.userID, workspaceID, Utils.array.withoutValue(projectLists, targetProjectList)),
    ]);
  }

  public async addProjectToList(userID: number, workspaceID: string, listID: string, projectID: string): Promise<void> {
    await this.applyPatch(userID, workspaceID, listID, (list) => ({
      projects: Utils.array.unique([projectID, ...list.projects]),
    }));
  }

  public async removeProjectFromList(authMeta: AuthMetaPayload, workspaceID: string, listID: string, projectID: string): Promise<void> {
    await Promise.all([
      this.logux.processAs(Realtime.project.crud.remove({ key: projectID, workspaceID }), authMeta),
      this.applyPatch(authMeta.userID, workspaceID, listID, (list) => ({
        projects: Utils.array.withoutValue(list.projects, projectID),
      })),
    ]);
  }

  public async transplantProjectBetweenLists(
    userID: number,
    workspaceID: string,
    { projectID: fromProjectID, listID: fromListID }: { projectID: string; listID: string },
    { index: toIndex, listID: toListID }: { listID: string; index: number }
  ): Promise<void> {
    const isReorder = fromListID === toListID;

    const lists = await this.getAll(userID, workspaceID);

    const updatedLists = lists.map((list) => {
      if (list.board_id === fromListID) {
        const fromProjectIndex = list.projects.indexOf(fromProjectID);

        return {
          ...list,
          projects: isReorder
            ? Utils.array.reorder(list.projects, fromProjectIndex, toIndex)
            : Utils.array.withoutValue(list.projects, fromProjectID),
        };
      }

      if (!isReorder && list.board_id === toListID) {
        return {
          ...list,
          projects: Utils.array.insert(list.projects, toIndex, fromProjectID),
        };
      }

      return list;
    });

    await this.replaceAll(userID, workspaceID, updatedLists);
  }
}
