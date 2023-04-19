import { SendBackActions } from '@logux/server';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { ChannelContext } from '@voiceflow/socket-utils';

import { AbstractChannelControl } from './utils';

class WorkspaceChannel extends AbstractChannelControl<Realtime.Channels.WorkspaceChannelParams> {
  protected channel = Realtime.Channels.workspace;

  private async normalizeProjectLists(
    creatorID: number,
    workspaceID: string,
    dbProjects: Realtime.DBProject[],
    dbProjectLists: Realtime.DBProjectList[],
    membersPerProject: Partial<Record<string, Realtime.ProjectMember[]>>
  ): Promise<[projects: Realtime.AnyProject[], projectLists: Realtime.ProjectList[]]> {
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
        normalizedLists.push({ name: Realtime.DEFAULT_PROJECT_LIST_NAME, board_id: Utils.id.cuid(), projects: unusedProjectsIDs });
      }

      await this.services.projectList.replaceAll(creatorID, workspaceID, normalizedLists);
    }

    return [
      Realtime.Adapters.projectAdapter.mapFromDB(dbProjects, { membersPerProject }),
      Realtime.Adapters.projectListAdapter.mapFromDB(normalizedLists),
    ];
  }

  protected access = async (ctx: ChannelContext<Realtime.Channels.WorkspaceChannelParams>): Promise<boolean> => {
    return this.services.workspace.access.canRead(Number(ctx.userId), ctx.params.workspaceID);
  };

  protected load = async (ctx: ChannelContext<Realtime.Channels.WorkspaceChannelParams>): Promise<SendBackActions> => {
    const creatorID = Number(ctx.userId);
    const { workspaceID } = ctx.params;

    const [dbWorkspace, dbProjects, dbProjectLists, viewersPerProject, membersPerProject, workspaceQuotas] = await Promise.all([
      this.services.workspace.get(creatorID, workspaceID),
      this.services.project.getAll(creatorID, workspaceID),
      this.services.projectList.getAll(creatorID, workspaceID),
      this.services.workspace.getConnectedViewersPerProject(workspaceID),
      this.services.project.member.getAllForWorkspace(creatorID, workspaceID),
      this.services.billing.getWorkspaceQuotas(creatorID, workspaceID).catch(() => []),
    ]);

    const [projects, projectLists] = await this.normalizeProjectLists(creatorID, workspaceID, dbProjects, dbProjectLists, membersPerProject);

    const workspace = Realtime.Adapters.workspaceAdapter.fromDB(dbWorkspace);

    return [
      Realtime.workspace.crud.update({ key: workspace.id, value: workspace }),
      Realtime.project.crud.replace({ values: projects, workspaceID }),
      Realtime.projectList.crud.replace({ values: projectLists, workspaceID }),
      Realtime.project.awareness.loadViewers({ viewers: viewersPerProject, workspaceID }),
      Realtime.workspace.quotas.loadAll({ workspaceID, quotas: workspaceQuotas }),
    ];
  };
}

export default WorkspaceChannel;
