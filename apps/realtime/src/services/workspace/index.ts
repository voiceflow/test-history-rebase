import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { HEARTBEAT_EXPIRE_TIMEOUT } from '../../constants';
import { AbstractControl, ControlOptions } from '../../control';
import logger from '../../logger';
import AccessCache from '../utils/accessCache';
import WorkspaceMemberService from './member';
import WorkspaceSettingsService from './settings';

export { default as WorkspaceSettingsService } from './settings';

class WorkspaceService extends AbstractControl {
  public access = new AccessCache('workspace', this.clients, this.services);

  public member: WorkspaceMemberService;

  public settings: WorkspaceSettingsService;

  private static getConnectedProjectsKey({ workspaceID }: { workspaceID: string }): string {
    return `workspaces:${workspaceID}:projects`;
  }

  private connectedProjectsCache = this.clients.cache.createSet({
    expire: HEARTBEAT_EXPIRE_TIMEOUT,
    keyCreator: WorkspaceService.getConnectedProjectsKey,
  });

  constructor(options: ControlOptions) {
    super(options);

    this.member = new WorkspaceMemberService(options);
    this.settings = new WorkspaceSettingsService(options);
  }

  public async connectProject(workspaceID: string, projectID: string): Promise<void> {
    await this.connectedProjectsCache.add({ workspaceID }, projectID);
  }

  public async disconnectProject(workspaceID: string, projectID: string): Promise<void> {
    await this.connectedProjectsCache.remove({ workspaceID }, projectID);
  }

  public async getConnectedProjects(workspaceID: string): Promise<string[]> {
    return this.connectedProjectsCache.values({ workspaceID });
  }

  public async getConnectedViewersPerProject(workspaceID: string): Promise<Record<string, Record<string, Realtime.Viewer[]>>> {
    const projectIDs = await this.getConnectedProjects(workspaceID);
    const projectsViewers = await Promise.all(projectIDs.map((projectID) => this.services.project.getConnectedViewersPerDiagram(projectID)));

    return Object.fromEntries(projectIDs.map((projectID, index) => [projectID, projectsViewers[index]]));
  }

  public async get(creatorID: number, workspaceID: string): Promise<Realtime.DBWorkspace> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    const [workspace, identityWorkspace, identityWorkspaceMembers, identityWorkspaceSettings] = await Promise.all([
      client.workspace.get(workspaceID),
      client.identity.workspace.findOne(workspaceID),
      this.member.getAll(creatorID, workspaceID),
      this.settings.getAll(creatorID, workspaceID),
    ]);

    return {
      ...workspace,
      name: identityWorkspace.name,
      image: identityWorkspace.image,
      members: identityWorkspaceMembers,
      created: identityWorkspace.createdAt,
      team_id: identityWorkspace.id,
      settings: identityWorkspaceSettings,
      organization_id: identityWorkspace.organizationID,
    };
  }

  public async getAll(creatorID: number): Promise<Realtime.DBWorkspace[]> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    const [workspaces, identityWorkspaces] = await Promise.all([client.workspace.list(), client.identity.workspace.list({ members: true })]);

    // this maps data from the new identity workspace to the old interface
    // we decided to do this just to communicate the intention of fully migrating in the future.
    // ideally all the extra data we have in the workspace interface should be fetched separately
    const legacyWorkspaceMap = Utils.array.createMap(workspaces, (workspace) => workspace.team_id);

    return identityWorkspaces.map((identityWorkspace) => {
      const workspace = legacyWorkspaceMap[identityWorkspace.id];

      return {
        ...workspace,
        name: identityWorkspace.name,
        image: identityWorkspace.image,
        created: identityWorkspace.createdAt,
        members: Realtime.Adapters.Identity.workspaceMember.mapFromDB(identityWorkspace.members ?? []),
        team_id: identityWorkspace.id,
        settings: {},
        organization_id: identityWorkspace.organizationID,
      };
    });
  }

  public async create(
    creatorID: number,
    { name, image, settings, organizationID }: { name: string; image?: string; settings?: Realtime.WorkspaceSettings; organizationID?: string }
  ): Promise<Realtime.DBWorkspace> {
    const [client] = await Promise.all([this.services.voiceflow.getClientByUserID(creatorID)]);

    const workspace = await client.identity.workspace.create({
      name,
      image,
      settings: settings && Realtime.Adapters.workspaceSettingsAdapter.toDB(settings),
      organizationID,
    });

    return this.get(creatorID, workspace.id);
  }

  public async checkout(creatorID: number, data: Realtime.workspace.CheckoutPayload): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.workspace.checkout(data.workspaceID, { ...Utils.object.omit(data, ['sourceID', 'workspaceID']), source_id: data.sourceID });
  }

  public async changeSeats(creatorID: number, workspaceID: string, data: { seats: number; schedule?: boolean }): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.workspace.changeSeats(workspaceID, data);
  }

  public async updateName(creatorID: number, workspaceID: string, name: string): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.identity.workspace.update(workspaceID, { name });
  }

  public async delete(creatorID: number, workspaceID: string): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);
    const projectIDs = await this.models.project.getIDsByWorkspaceID(workspaceID);

    if (projectIDs.length) {
      await client.project.deleteMany(projectIDs);
    }

    await client.identity.workspace.remove(workspaceID);
    await client.workspace.deleteStripeSubscription(workspaceID).catch((error) => logger.warn(error, 'delete stripe subscription error'));

    // TODO: move to identity when creator-api gets phased out
    await this.services.billing.deleteWorkspaceQuotas(creatorID, workspaceID).catch((error) => logger.warn(error, 'delete workspace quotas error'));
  }

  private async getOrganization(creatorID: number, workspaceID: string): Promise<Realtime.Organization | undefined> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.identity.workspace.getOrganization(workspaceID);
  }

  public async isFeatureEnabled(creatorID: number, workspaceID: string | undefined, feature: Realtime.FeatureFlag): Promise<boolean> {
    const organization = await (workspaceID ? this.getOrganization(creatorID, workspaceID) : undefined);

    return this.services.feature.isEnabled(feature, { userID: creatorID, workspaceID, organizationID: organization?.id });
  }
}

export default WorkspaceService;
