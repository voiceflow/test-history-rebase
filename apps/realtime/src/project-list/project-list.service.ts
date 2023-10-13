import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { NotFoundException } from '@voiceflow/exception';
import { HashedIDService } from '@voiceflow/nestjs-common';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import { WorkspaceProjectListsORM } from '@voiceflow/orm-designer';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { sanitizePatch } from '@voiceflow/socket-utils';

@Injectable()
export class ProjectListService {
  constructor(
    @Inject(WorkspaceProjectListsORM)
    private readonly orm: WorkspaceProjectListsORM,
    @Inject(LoguxService)
    private readonly logux: LoguxService,
    @Inject(HashedIDService)
    protected readonly hashedIDService: HashedIDService
  ) {}

  private async applyListPatchByWorkspaceID(
    workspaceID: number,
    listID: string,
    transform: (data: Realtime.ProjectList) => Partial<Realtime.ProjectList>
  ): Promise<void> {
    const projectLists = await this.findListsByWorkspaceID(workspaceID);

    const patched = projectLists.map((dbList) => {
      if (dbList.board_id !== listID) return dbList;

      const list = Realtime.Adapters.projectListAdapter.fromDB(dbList);

      return Realtime.Adapters.projectListAdapter.toDB({ ...list, ...sanitizePatch(transform(list)) });
    });

    await this.replaceLists(workspaceID, patched);
  }

  public async findOneByWorkspaceOrFail(workspaceID: number) {
    try {
      return await this.orm.findOneByWorkspaceOrFail(workspaceID);
    } catch (error) {
      throw new NotFoundException(`Failed to find workspace project lists for workspace ${workspaceID}`);
    }
  }

  public async findListsByWorkspaceID(workspaceID: number): Promise<Realtime.DBProjectList[]> {
    const projectLists = await this.findOneByWorkspaceOrFail(workspaceID);

    return JSON.parse(projectLists.projectLists);
  }

  public async getDefaultList(workspaceID: number): Promise<Realtime.DBProjectList | null> {
    const projectLists = await this.findListsByWorkspaceID(workspaceID);

    return projectLists.find((list) => list.name === Realtime.DEFAULT_PROJECT_LIST_NAME) ?? null;
  }

  public async replaceLists(workspaceID: number, projectLists: Realtime.DBProjectList[]): Promise<void> {
    await this.orm.updateOneByWorkspace(workspaceID, { projectLists: JSON.stringify(projectLists) });
  }

  public async addOneList(workspaceID: number, data: Realtime.DBProjectList): Promise<void> {
    const projectLists = await this.findListsByWorkspaceID(workspaceID);

    await this.replaceLists(workspaceID, [...projectLists, data]);
  }

  public async patchOneList(workspaceID: number, listID: string, data: Partial<Realtime.ProjectList>): Promise<void> {
    await this.applyListPatchByWorkspaceID(workspaceID, listID, () => Utils.object.pick(data, ['name']));
  }

  public async moveLists(workspaceID: number, fromListID: string, toListIndex: number): Promise<void> {
    const projectLists = await this.findListsByWorkspaceID(workspaceID);

    const fromIndex = projectLists.findIndex((list) => list.board_id === fromListID);

    if (toListIndex === fromIndex) return;

    await this.replaceLists(workspaceID, Utils.array.reorder(projectLists, fromIndex, toListIndex));
  }

  public async removeList(authMeta: AuthMetaPayload, workspaceID: number, listID: string): Promise<void> {
    const projectLists = await this.findListsByWorkspaceID(workspaceID);

    const targetProjectList = projectLists.find((list) => list.board_id === listID);

    if (!targetProjectList) return;

    await Promise.all([
      this.logux.processAs(
        Realtime.project.crud.removeMany({ keys: targetProjectList.projects, workspaceID: this.hashedIDService.encodeWorkspaceID(workspaceID) }),
        authMeta
      ),
      this.replaceLists(workspaceID, Utils.array.withoutValue(projectLists, targetProjectList)),
    ]);
  }

  public async addProjectToList(workspaceID: number, listID: string, projectID: string): Promise<void> {
    await this.applyListPatchByWorkspaceID(workspaceID, listID, (list) => ({
      projects: Utils.array.unique([projectID, ...list.projects]),
    }));
  }

  public async removeProjectFromList(authMeta: AuthMetaPayload, workspaceID: number, listID: string, projectID: string): Promise<void> {
    await Promise.all([
      this.logux.processAs(
        Realtime.project.crud.remove({ key: projectID, workspaceID: this.hashedIDService.encodeWorkspaceID(workspaceID) }),
        authMeta
      ),
      this.applyListPatchByWorkspaceID(workspaceID, listID, (list) => ({
        projects: Utils.array.withoutValue(list.projects, projectID),
      })),
    ]);
  }

  public async transplantProjectBetweenLists(
    workspaceID: number,
    { projectID: fromProjectID, listID: fromListID }: { projectID: string; listID: string },
    { index: toIndex, listID: toListID }: { listID: string; index: number }
  ): Promise<void> {
    const isReorder = fromListID === toListID;

    const lists = await this.findListsByWorkspaceID(workspaceID);

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

    await this.replaceLists(workspaceID, updatedLists);
  }
}
