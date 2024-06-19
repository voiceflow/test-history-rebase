import { Controller, Inject } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { HashedIDService } from '@voiceflow/nestjs-common';
import { AuthMeta, AuthMetaPayload, Channel, Context } from '@voiceflow/nestjs-logux';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { Channels } from '@voiceflow/sdk-logux-designer';

import { InjectRequestContext, UseRequestContext } from '@/common';
import { ProjectService } from '@/project/project.service';
import { ProjectListService } from '@/project-list/project-list.service';

import { WorkspaceBillingService } from './billing/billing.service';
import { WorkspaceConnectedProjectsService } from './connected-projects/connected-projects.service';
import { WorkspaceService } from './workspace.service';

@Controller()
@InjectRequestContext()
export class WorkspaceLoguxController {
  // eslint-disable-next-line max-params
  constructor(
    @Inject(HashedIDService)
    private readonly hashedID: HashedIDService,
    @Inject(ProjectService)
    private readonly projectService: ProjectService,
    @Inject(WorkspaceService)
    private readonly workspaceService: WorkspaceService,
    @Inject(WorkspaceBillingService)
    private readonly workspaceBillingService: WorkspaceBillingService,
    @Inject(WorkspaceConnectedProjectsService)
    private readonly workspaceConnectedProjectsService: WorkspaceConnectedProjectsService,
    @Inject(ProjectListService)
    private readonly projectListService: ProjectListService
  ) {}

  normalizeProjectLists = async (
    workspaceID: string,
    projects: Realtime.AnyProject[],
    dbProjectLists: Realtime.DBProjectList[]
  ): Promise<Realtime.ProjectList[]> => {
    const projectIDsSet = new Set(projects.map(({ id }) => id));

    // determine if there are any projects not on a board
    const usedProjectsIDs = new Set<string>();

    const normalizedLists: Realtime.DBProjectList[] = dbProjectLists.map((list) => {
      const projects = [...new Set(list.projects)].filter(
        (projectID) => projectIDsSet.has(projectID) && !usedProjectsIDs.has(projectID)
      );

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
        normalizedLists.push({
          name: Realtime.DEFAULT_PROJECT_LIST_NAME,
          board_id: Utils.id.cuid(),
          projects: unusedProjectsIDs,
        });
      }

      await this.projectListService.replaceMany(this.hashedID.decodeWorkspaceID(workspaceID), normalizedLists);
    }

    return Realtime.Adapters.projectListAdapter.mapFromDB(normalizedLists);
  };

  @Channel(Channels.workspace)
  @Authorize.Permissions<Channels.WorkspaceParams>([Permission.WORKSPACE_READ], ({ workspaceID }) => ({
    id: workspaceID,
    kind: 'workspace',
  }))
  @UseRequestContext()
  async subscribe(@Context() ctx: Context.Channel<Channels.WorkspaceParams>, @AuthMeta() authMeta: AuthMetaPayload) {
    const { workspaceID } = ctx.params;

    const [dbWorkspace, projects, dbProjectLists, viewersPerProject, workspaceQuotas] = await Promise.all([
      this.workspaceService.findOne(authMeta.userID, workspaceID),
      this.projectService.findManyLegacyProjectsByWorkspaceID(this.hashedID.decodeWorkspaceID(workspaceID)),
      this.projectListService.findManyByWorkspaceID(this.hashedID.decodeWorkspaceID(workspaceID)),
      this.workspaceConnectedProjectsService.getConnectedViewersPerProject(workspaceID),
      this.workspaceBillingService.getWorkspaceQuotas(authMeta.userID, workspaceID).catch(() => []),
    ]);

    const projectLists = await this.normalizeProjectLists(workspaceID, projects, dbProjectLists);

    const workspace = Realtime.Adapters.workspaceAdapter.fromDB(dbWorkspace);

    const features = await this.workspaceService.getFeatures(
      authMeta.userID,
      workspaceID,
      workspace.organizationID ?? ''
    );

    return [
      Realtime.workspace.crud.update({ key: workspace.id, value: workspace }),
      Realtime.project.crud.replace({ values: projects, workspaceID }),
      Realtime.projectList.crud.replace({ values: projectLists, workspaceID }),
      Realtime.project.awareness.loadViewers({ viewers: viewersPerProject, workspaceID }),
      Realtime.workspace.quotas.loadAll({ workspaceID, quotas: workspaceQuotas }),
      Realtime.feature.loadWorkspaceFeatures({ features, workspaceID }),
    ];
  }
}
