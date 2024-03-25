import { Inject, Injectable, Logger } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { HashedIDService } from '@voiceflow/nestjs-common';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import { WorkspaceProjectListsORM } from '@voiceflow/orm-designer';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { sanitizePatch } from '@voiceflow/socket-utils';

@Injectable()
export class ProjectListService {
  private readonly logger = new Logger(ProjectListService.name);

  constructor(
    @Inject(WorkspaceProjectListsORM)
    private readonly orm: WorkspaceProjectListsORM,
    @Inject(LoguxService)
    private readonly logux: LoguxService,
    @Inject(HashedIDService)
    protected readonly hashedIDService: HashedIDService
  ) {}

  private async applyPatchByWorkspace(
    workspaceID: number,
    listID: string,
    transform: (data: Realtime.ProjectList) => Partial<Realtime.ProjectList>
  ): Promise<Realtime.DBProjectList | null> {
    const projectLists = await this.findManyByWorkspaceID(workspaceID);

    let patchedProjectList: Realtime.DBProjectList | null = null;

    const patched = projectLists.map((dbList) => {
      if (dbList.board_id !== listID) return dbList;

      const list = Realtime.Adapters.projectListAdapter.fromDB(dbList);

      patchedProjectList = Realtime.Adapters.projectListAdapter.toDB({ ...list, ...sanitizePatch(transform(list)) });

      return patchedProjectList;
    });

    await this.replaceMany(workspaceID, patched);

    return patchedProjectList;
  }

  public async findManyByWorkspaceID(workspaceID: number): Promise<Realtime.DBProjectList[]> {
    try {
      const projectLists = await this.orm.findOneByWorkspace(workspaceID);

      if (!projectLists) return [];

      return JSON.parse(projectLists.projectLists);
    } catch (error) {
      this.logger.warn(error, `[findManyByWorkspaceID] ${workspaceID}`);
      return [];
    }
  }

  public async getDefaultList(workspaceID: number): Promise<Realtime.DBProjectList | null> {
    const projectLists = await this.findManyByWorkspaceID(workspaceID);

    return projectLists.find((list) => list.name === Realtime.DEFAULT_PROJECT_LIST_NAME) ?? null;
  }

  public async acquireList(workspaceID: number, projectListID?: string | null) {
    let projectList: Realtime.DBProjectList | null = null;

    if (projectListID) {
      const projectLists = await this.findManyByWorkspaceID(workspaceID);

      projectList = projectLists.find((list) => list.board_id === projectListID) ?? null;
    }

    // check for an existing default list
    if (!projectList) {
      projectList = await this.getDefaultList(workspaceID);
    }

    let projectListCreated = false;
    // create a new default list
    if (!projectList) {
      projectList = { board_id: Utils.id.cuid(), name: Realtime.DEFAULT_PROJECT_LIST_NAME, projects: [] };

      await this.createOne(workspaceID, projectList);

      projectListCreated = true;
    }

    return { projectList, projectListCreated };
  }

  public async replaceMany(workspaceID: number, projectLists: Realtime.DBProjectList[]): Promise<void> {
    try {
      await this.orm.upsertOneByWorkspace(workspaceID, { projectLists: JSON.stringify(projectLists) });
    } catch (err) {
      this.logger.error(err);
    }
  }

  public async createOne(workspaceID: number, data: Realtime.DBProjectList): Promise<void> {
    const projectLists = await this.findManyByWorkspaceID(workspaceID);

    await this.replaceMany(workspaceID, [...projectLists, data]);
  }

  public async patchOne(workspaceID: number, listID: string, data: Partial<Realtime.ProjectList>): Promise<Realtime.DBProjectList | null> {
    return this.applyPatchByWorkspace(workspaceID, listID, () => Utils.object.pick(data, ['name']));
  }

  public async moveOne(workspaceID: number, fromListID: string, toListIndex: number): Promise<void> {
    const projectLists = await this.findManyByWorkspaceID(workspaceID);

    const fromIndex = projectLists.findIndex((list) => list.board_id === fromListID);

    if (toListIndex === fromIndex) return;

    await this.replaceMany(workspaceID, Utils.array.reorder(projectLists, fromIndex, toListIndex));
  }

  public async removeOne(authMeta: AuthMetaPayload, workspaceID: number, listID: string): Promise<void> {
    const projectLists = await this.findManyByWorkspaceID(workspaceID);

    const targetProjectList = projectLists.find((list) => list.board_id === listID);

    if (!targetProjectList) return;

    await Promise.all([
      this.logux.processAs(
        Realtime.project.crud.removeMany({ keys: targetProjectList.projects, workspaceID: this.hashedIDService.encodeWorkspaceID(workspaceID) }),
        authMeta
      ),
      this.replaceMany(workspaceID, Utils.array.withoutValue(projectLists, targetProjectList)),
    ]);
  }

  public async addProjectToList(workspaceID: number, listID: string, projectID: string): Promise<Realtime.DBProjectList | null> {
    return this.applyPatchByWorkspace(workspaceID, listID, (list) => ({ projects: Utils.array.unique([projectID, ...list.projects]) }));
  }

  public async removeProjectFromList(authMeta: AuthMetaPayload, workspaceID: number, listID: string, projectID: string): Promise<void> {
    await Promise.all([
      this.logux.processAs(
        Realtime.project.crud.remove({ key: projectID, workspaceID: this.hashedIDService.encodeWorkspaceID(workspaceID) }),
        authMeta
      ),
      this.applyPatchByWorkspace(workspaceID, listID, (list) => ({
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

    const lists = await this.findManyByWorkspaceID(workspaceID);

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

    await this.replaceMany(workspaceID, updatedLists);
  }
}
