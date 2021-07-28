import { SendBackActions } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk';
import cuid from 'cuid';

import { AbstractChannelControl, ChannelContext } from './utils';

class WorkspaceChannel extends AbstractChannelControl<Realtime.Channels.WorkspaceChannelParams> {
  private static normalizeProjectLists(
    dbProjects: Realtime.DBProject[],
    dbProjectLists: Realtime.DBProjectList[]
  ): [projects: Realtime.AnyProject[], projectLists: Realtime.ProjectList[]] {
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

    return [Realtime.Adapters.projectAdapter.mapFromDB(dbProjects), Realtime.Adapters.projectListAdapter.mapFromDB(normalizedLists)];
  }

  channel = Realtime.Channels.workspace({ workspaceID: ':workspaceID' });

  protected access = async (ctx: ChannelContext<Realtime.Channels.WorkspaceChannelParams>): Promise<boolean> => {
    return this.services.workspace.canRead(ctx.params.workspaceID, Number(ctx.userId));
  };

  protected load = async (ctx: ChannelContext<Realtime.Channels.WorkspaceChannelParams>): Promise<SendBackActions> => {
    const [dbProjects, dbProjectLists] = await Promise.all([
      this.services.project.getAll(ctx.params.workspaceID, Number(ctx.userId)),
      this.services.projectList.getAll(ctx.params.workspaceID, Number(ctx.userId)),
    ] as const);

    const [projects, projectLists] = WorkspaceChannel.normalizeProjectLists(dbProjects, dbProjectLists);

    return [
      Realtime.project.crudActions.replace({ values: projects, workspaceID: ctx.params.workspaceID }),
      Realtime.projectList.crudActions.replace({ values: projectLists, workspaceID: ctx.params.workspaceID }),
    ];
  };
}

export default WorkspaceChannel;
