import { Inject, Injectable } from '@nestjs/common';
import { Organization, TakenSeats } from '@voiceflow/dtos';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { IdentityClient } from '@voiceflow/sdk-identity';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { UserService } from '@/user/user.service';

import { organizationAdapter } from './identity.adapter';

@Injectable()
export class OrganizationIdentityService {
  constructor(
    @Inject(UserService)
    private readonly user: UserService,
    @Inject(IdentityClient)
    private readonly identityClient: IdentityClient,
    @Inject(LoguxService)
    private readonly logux: LoguxService
  ) {}

  public async getAll(creatorID: number): Promise<Organization[]> {
    const token = await this.user.getTokenByID(creatorID);

    const allOrganizations = (await this.identityClient.organization.findManyByUserID(
      {
        members: true,
        trial: true,
      },
      {
        headers: { Authorization: token },
      }
    )) as Realtime.Identity.Organization[];

    return organizationAdapter.mapFromDB(allOrganizations);
  }

  public async getOrganization(creatorID: number, organizationID: string): Promise<Organization | null> {
    const allOrganizations = await this.getAll(creatorID);
    return allOrganizations.find((o) => o.id === organizationID) || null;
  }

  public async patchOne(creatorID: number, organizationID: string, values: Partial<Organization>): Promise<void> {
    const token = await this.user.getTokenByID(creatorID);

    await this.identityClient.organization.patchOne(organizationID, values, {
      headers: { Authorization: token },
    });
  }

  public async getWorkspacesByOrganizationID(organizationID: string): Promise<Realtime.Identity.Workspace[]> {
    const workspaces = await this.identityClient.private.findAllWorkspacesByOrganizationID(organizationID);

    return workspaces.map((w) => ({
      id: w.id,
      name: w.name,
      image: w.image || '',
      settings: w.settings,
      organizationID: w.organizationID,
      createdAt: w.createdAt,
      updatedAt: w.updatedAt,
    }));
  }

  public async getTakenSeats(organizationID: string): Promise<TakenSeats> {
    return this.identityClient.private.getOrganizationTakenSeats(organizationID);
  }

  public async getTakenSeatsAndBroadcast(organizationID: string, authMeta: AuthMetaPayload) {
    const [takenSeats, workspaces] = await Promise.all([this.getTakenSeats(organizationID), this.getWorkspacesByOrganizationID(organizationID)]);

    // Because of permissions, we had to add workspaceID to organization subscription, which creates a different channel address for each workspace
    // This is why we need to broadcast to each workspace separately
    await Promise.all(
      workspaces.map(({ id: workspaceID }) =>
        this.logux.processAs(
          Actions.OrganizationTakenSeats.Replace({
            takenSeats,
            context: { organizationID, workspaceID },
          }),
          authMeta
        )
      )
    );
  }

  public async getTakenSeatsAndBroadcastFromWorkspaceID(workspaceID: string, authMeta: AuthMetaPayload) {
    const token = await this.user.getTokenByID(authMeta.userID);
    const workspace = await this.identityClient.workspace.findOne(workspaceID, { headers: { Authorization: token } });

    if (!workspace) {
      return;
    }

    await this.getTakenSeatsAndBroadcast(workspace.organizationID, authMeta);
  }
}
