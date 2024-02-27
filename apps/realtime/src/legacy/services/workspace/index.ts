import { Organization } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { HEARTBEAT_EXPIRE_TIMEOUT } from '@/constants';

import { AbstractControl, ControlOptions } from '../../control';
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

  public async get(workspaceID: string): Promise<Realtime.DBWorkspace> {
    const [identityWorkspace, identityWorkspaceMembers, identityWorkspaceSettings] = await Promise.all([
      this.services.identity.private.findOne(workspaceID),
      this.member.getAll(workspaceID), // no private route for this yet
      this.settings.getAll(workspaceID),
    ]);

    const workspace = identityWorkspace as unknown as Realtime.Identity.WorkspaceCombined;

    return {
      ...workspace,
      created: workspace.createdAt,
      stripe_status: workspace.stripeStatus,
      organization_id: workspace.organizationID,
      creator_id: workspace.createdBy,
      team_id: workspace.id,
      members: identityWorkspaceMembers,
      settings: identityWorkspaceSettings,
      organization_trial_days_left: workspace.organizationTrialDaysLeft,
    };
  }

  public async getAll(creatorID: number): Promise<Realtime.DBWorkspace[]> {
    const client = await this.services.voiceflow.client.getByUserID(creatorID);

    const workspaces = await client.identity.workspace.list({ members: true });

    return workspaces.map((workspace) => {
      return {
        ...workspace,
        created: workspace.createdAt,
        stripe_status: workspace.stripeStatus,
        organization_id: workspace.organizationID,
        creator_id: workspace.createdBy,
        team_id: workspace.id,
        organization_trial_days_left: workspace.organizationTrialDaysLeft,
        members: Realtime.Adapters.Identity.workspaceMember.mapFromDB(workspace.members ?? []),
        settings: {},
      };
    });
  }

  public async create(
    creatorID: number,
    { name, image, settings, organizationID }: { name: string; image?: string; settings?: Realtime.WorkspaceSettings; organizationID?: string }
  ): Promise<Realtime.DBWorkspace> {
    const [client] = await Promise.all([this.services.voiceflow.client.getByUserID(creatorID)]);

    const workspace = await client.identity.workspace.create({
      name,
      image,
      settings: settings && Realtime.Adapters.workspaceSettingsAdapter.toDB(settings),
      organizationID,
    });

    return this.get(workspace.id);
  }

  public async checkout(creatorID: number, { workspaceID, ...data }: Realtime.workspace.CheckoutPayload): Promise<void> {
    const client = await this.services.voiceflow.client.getByUserID(creatorID);

    return client.billing.workspace.checkout(workspaceID, data);
  }

  public async changeSeats(creatorID: number, workspaceID: string, data: { seats: number; schedule?: boolean }): Promise<void> {
    const client = await this.services.voiceflow.client.getByUserID(creatorID);

    return client.workspace.changeSeats(workspaceID, data);
  }

  public async updateName(creatorID: number, workspaceID: string, name: string): Promise<void> {
    const client = await this.services.voiceflow.client.getByUserID(creatorID);

    await client.identity.workspace.update(workspaceID, { name });
  }

  public async delete(creatorID: number, workspaceID: string): Promise<void> {
    const client = await this.services.voiceflow.client.getByUserID(creatorID);
    const projectIDs = await this.models.project.getIDsByWorkspaceID(workspaceID);

    if (projectIDs.length) {
      await client.project.deleteMany(projectIDs);
    }

    await client.identity.workspace.remove(workspaceID);
    await client.workspace.deleteStripeSubscription(workspaceID).catch((error) => this.log.warn(error, 'delete stripe subscription error'));

    // TODO: move to identity when creator-api gets phased out
    await this.services.billing.deleteWorkspaceQuotas(creatorID, workspaceID).catch((error) => this.log.warn(error, 'delete workspace quotas error'));
  }

  private async getOrganization(creatorID: number, workspaceID: string): Promise<Organization | undefined> {
    const client = await this.services.voiceflow.client.getByUserID(creatorID);

    return client.identity.workspace.getOrganization(workspaceID);
  }

  public async isFeatureEnabled(creatorID: number, workspaceID: string | undefined, feature: Realtime.FeatureFlag): Promise<boolean> {
    const [workspace, organization] = await Promise.all([
      workspaceID ? this.get(workspaceID) : null,
      workspaceID ? this.getOrganization(creatorID, workspaceID) : undefined,
    ]);

    return this.services.feature.isEnabled(feature, {
      userID: creatorID,
      workspaceID,
      organizationID: organization?.id,
      workspaceCreatedAt: workspace?.created,
    });
  }

  public async downgradeTrial(creatorID: number, workspaceID: string): Promise<void> {
    const client = await this.services.voiceflow.client.getByUserID(creatorID);

    await client.billing.privateWorkspace.downgradeTrial(workspaceID);
  }
}

export default WorkspaceService;
