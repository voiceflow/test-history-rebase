import { SendBackActions } from '@logux/server';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { ChannelContext } from '@voiceflow/socket-utils';

import { AbstractChannelControl } from './utils';

class WorkspaceChannel extends AbstractChannelControl<Realtime.Channels.WorkspaceChannelParams> {
  protected channel = Realtime.Channels.workspace;

  private async normalizeProjectLists(
    workspaceID: string,
    projects: Realtime.AnyProject[],
    dbProjectLists: Realtime.DBProjectList[]
  ): Promise<Realtime.ProjectList[]> {
    const projectIDsSet = new Set(projects.map(({ id }) => id));

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

      await this.services.requestContext.createAsync(() =>
        this.services.projectList.replaceMany(this.services.hashedID.decodeWorkspaceID(workspaceID), normalizedLists)
      );
    }

    return Realtime.Adapters.projectListAdapter.mapFromDB(normalizedLists);
  }

  private async getFeatures(creatorID: number, workspaceID: string, organizationID: string) {
    const creatorClient = await this.services.creator.client.getByUserID(creatorID);
    return creatorClient.feature.getStatuses({ workspaceID, organizationID });
  }

  protected access = async (ctx: ChannelContext<Realtime.Channels.WorkspaceChannelParams>): Promise<boolean> => {
    return this.services.workspace.access.canRead(Number(ctx.userId), ctx.params.workspaceID);
  };

  protected load = async (ctx: ChannelContext<Realtime.Channels.WorkspaceChannelParams>): Promise<SendBackActions> => {
    const creatorID = Number(ctx.userId);
    const { workspaceID } = ctx.params;

    const [dbWorkspace, projects, dbProjectLists, viewersPerProject, workspaceQuotas] = await Promise.all([
      this.services.workspace.get(workspaceID),
      this.services.requestContext.createAsync(() =>
        this.services.projectV2.findManyLegacyProjectsByWorkspaceID(this.services.hashedID.decodeWorkspaceID(workspaceID))
      ),
      this.services.requestContext.createAsync(() =>
        this.services.projectList.findManyByWorkspaceID(this.services.hashedID.decodeWorkspaceID(workspaceID))
      ),
      this.services.workspace.getConnectedViewersPerProject(workspaceID),
      this.services.billing.getWorkspaceQuotas(creatorID, workspaceID).catch(() => []),
    ]);

    const projectLists = await this.normalizeProjectLists(workspaceID, projects, dbProjectLists);

    const workspace = Realtime.Adapters.workspaceAdapter.fromDB(dbWorkspace);

    const features = await this.getFeatures(creatorID, workspaceID, workspace.organizationID ?? '');

    return [
      Realtime.workspace.crud.update({ key: workspace.id, value: workspace }),
      Realtime.project.crud.replace({ values: projects, workspaceID }),
      Realtime.projectList.crud.replace({ values: projectLists, workspaceID }),
      Realtime.project.awareness.loadViewers({ viewers: viewersPerProject, workspaceID }),
      Realtime.workspace.quotas.loadAll({ workspaceID, quotas: workspaceQuotas }),
      Realtime.feature.loadWorkspaceFeatures({ features, workspaceID }),
    ];
  };
}

export default WorkspaceChannel;
