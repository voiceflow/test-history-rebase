import * as Realtime from '@voiceflow/realtime-sdk';
import cuid from 'cuid';

import { AbstractControl } from '../control';

class ProjectListService extends AbstractControl {
  private static getCanReadKey({ projectListID, creatorID }: { projectListID: string; creatorID: number }): string {
    return `projectList:${projectListID}:can-read:${creatorID}`;
  }

  private static normalizeProjectLists(
    dbProjects: Realtime.DBProject[],
    dbProjectLists: Realtime.DBProjectList[]
  ): [projects: Realtime.DBProject[], projectLists: Realtime.DBProjectList[]] {
    const projectIDsSet = new Set(dbProjects.map(({ _id }) => _id));

    // determine if there are any projects not on a board
    const usedProjectsIDs = new Set<string>();

    const normalizedLists: Realtime.DBProjectList[] = dbProjectLists.map((list) => {
      const projects = [...new Set(list.projects)].filter((projectID) => projectIDsSet.has(projectID) && !usedProjectsIDs.has(projectID));

      projects.forEach((projectID) => usedProjectsIDs.add(projectID));

      return { ...list, projects };
    });

    const unusedProjectsIDs = [...projectIDsSet].filter((projectID) => !usedProjectsIDs.has(projectID));

    // dump all projects not used in any of the other lists
    if (unusedProjectsIDs.length > 0) {
      const defaultList = normalizedLists.find((list) => list.name === Realtime.DEFAULT_PROJECT_LIST_NAME);

      if (defaultList) {
        const projects = [...new Set([...defaultList.projects, ...unusedProjectsIDs])];

        normalizedLists.splice(normalizedLists.indexOf(defaultList), 1, { ...defaultList, projects });
      } else {
        normalizedLists.push({ name: Realtime.DEFAULT_PROJECT_LIST_NAME, board_id: cuid(), projects: unusedProjectsIDs });
      }
    }

    return [dbProjects, normalizedLists];
  }

  private canReadCache = this.clients.cache.createKeyValue({
    adapter: this.clients.cache.adapters.booleanAdapter,
    keyCreator: ProjectListService.getCanReadKey,
  });

  public async canRead(projectListID: string, creatorID: number): Promise<boolean> {
    const cachedCanRead = await this.canReadCache.get({ projectListID, creatorID });

    if (cachedCanRead !== null) {
      return cachedCanRead;
    }

    const client = await this.services.voiceflow.getClientByUserID(creatorID);
    const canRead = await client.workspace.canRead(creatorID, projectListID);

    await this.canReadCache.set({ projectListID, creatorID }, canRead);

    return canRead;
  }

  public async getAll(workspaceID: string, creatorID: number): Promise<Realtime.DBProjectList[]> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.projectList.getAll(workspaceID);
  }

  public async getAllWithNormalizedProjects(
    workspaceID: string,
    creatorID: number
  ): Promise<[projects: Realtime.DBProject[], projectLists: Realtime.DBProjectList[]]> {
    const [dbProjectLists, dbProjects] = await Promise.all([
      this.getAll(workspaceID, creatorID),
      this.services.project.getAll(workspaceID, creatorID),
    ] as const);

    return ProjectListService.normalizeProjectLists(dbProjects, dbProjectLists);
  }
}

export default ProjectListService;
