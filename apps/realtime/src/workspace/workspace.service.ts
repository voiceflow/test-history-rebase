import { Inject, Injectable } from '@nestjs/common';
import { HashedIDService } from '@voiceflow/nestjs-common';
import { AssistantORM, ProjectORM } from '@voiceflow/orm-designer';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { IdentityClient } from '@voiceflow/sdk-identity';

import { LegacyService } from '@/legacy/legacy.service';
import { UserService } from '@/user/user.service';

import { WorkspaceBillingService } from './billing/billing.service';

@Injectable()
export class WorkspaceService {
  // eslint-disable-next-line max-params
  constructor(
    @Inject(AssistantORM) protected readonly assistantORM: AssistantORM,
    @Inject(ProjectORM) protected readonly projectORM: ProjectORM,
    @Inject(UserService) private readonly userService: UserService,
    @Inject(IdentityClient) private readonly identityClient: IdentityClient,
    @Inject(LegacyService) private readonly legacy: LegacyService,
    @Inject(HashedIDService) private readonly hashedID: HashedIDService,
    @Inject(WorkspaceBillingService) private readonly workspaceBilling: WorkspaceBillingService
  ) {}

  public async findOne(userID: number, workspaceID: string): Promise<Realtime.DBWorkspace> {
    const authHeaders = await this.userService.getAuthHeadersByID(userID);

    const [identityWorkspace, identityWorkspaceMembers, identityWorkspaceSettings] = await Promise.all([
      this.identityClient.private.findOne(workspaceID),
      this.identityClient.workspaceMember.findAll(workspaceID, {
        headers: authHeaders,
      }),
      this.identityClient.workspaceProperty.findAllPropertiesByWorkspaceID(workspaceID, {
        headers: authHeaders,
      }),
    ]);

    return {
      ...identityWorkspace,
      stripe_status: identityWorkspace.stripeStatus as Realtime.DBWorkspace['stripe_status'],
      plan: identityWorkspace.plan as Realtime.DBWorkspace['plan'],
      beta_flag: identityWorkspace.betaFlag ?? null,
      created: identityWorkspace.createdAt,
      organization_id: identityWorkspace.organizationID,
      team_id: identityWorkspace.id,
      members: identityWorkspaceMembers.map(({ user, membership }) => ({
        name: user.name,
        email: user.email,
        image: user.image,
        created: user.createdAt,
        role: membership.role,
        // TODO: refactor to creatorID
        creator_id: user.id,
      })),
      settings: {
        aiAssist: identityWorkspaceSettings.settingsAiAssist,
        dashboardKanban: identityWorkspaceSettings.settingsDashboardKanban,
      },
      organization_trial_days_left: identityWorkspace.organizationTrialDaysLeft,
    };
  }

  public async getAll(creatorID: number): Promise<Realtime.DBWorkspace[]> {
    const headers = await this.userService.getAuthHeadersByID(creatorID);
    const workspaces = await this.identityClient.workspace.findAllSelf(
      { members: true },
      {
        headers,
      }
    );

    return workspaces.map((workspace) => {
      return {
        ...workspace,
        created: workspace.createdAt,
        stripe_status: workspace.stripeStatus as Realtime.DBWorkspace['stripe_status'],
        plan: workspace.plan as Realtime.DBWorkspace['plan'],
        organization_id: workspace.organizationID,
        team_id: workspace.id,
        beta_flag: workspace.betaFlag,
        organization_trial_days_left: workspace.organizationTrialDaysLeft,
        members: Realtime.Adapters.Identity.workspaceMember.mapFromDB(workspace.members ?? []),
        settings: {},
      };
    });
  }

  public async create(
    creatorID: number,
    {
      name,
      image,
      settings,
      organizationID,
    }: { name: string; image?: string; settings?: Realtime.WorkspaceSettings; organizationID?: string }
  ): Promise<Realtime.DBWorkspace> {
    const workspace = await this.identityClient.workspace.create(
      {
        name,
        image,
        settings: settings && Realtime.Adapters.workspaceSettingsAdapter.toDB(settings),
        organizationID,
      },
      { headers: await this.userService.getAuthHeadersByID(creatorID) }
    );

    return this.findOne(creatorID, workspace.id);
  }

  public async patch(creatorID: number, workspaceID: string, payload: { name?: string } = {}): Promise<void> {
    await this.identityClient.workspace.patchOne(workspaceID, payload, {
      headers: await this.userService.getAuthHeadersByID(creatorID),
    });
  }

  public async delete(creatorID: number, workspaceID: string): Promise<void> {
    const rawWorkspaceID = this.hashedID.decodeWorkspaceID(workspaceID);

    await Promise.all([
      this.assistantORM.deleteManyByWorkspace(rawWorkspaceID),
      this.projectORM.deleteManyByWorkspaceID(rawWorkspaceID),
    ]);

    await this.identityClient.workspace.deleteOne(workspaceID, {
      headers: await this.userService.getAuthHeadersByID(creatorID),
    });

    // FIXME: remove this once everyone is on chargebee.
    await this.workspaceBilling.deleteWorkspaceSubscription(creatorID, workspaceID);
  }

  public async getFeatures(userID: number, workspaceID: string, organizationID: string) {
    const creatorClient = await this.legacy.services.creator.client.getByUserID(userID);

    // FIXME: user should add a new method to unleash client, to get all statuses
    return creatorClient.feature.getStatuses({
      workspaceID,
      organizationID,
    });
  }
}
