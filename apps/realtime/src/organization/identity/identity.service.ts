import { Inject, Injectable } from '@nestjs/common';
import { Organization } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { IdentityClient } from '@voiceflow/sdk-identity';

import { UserService } from '@/user/user.service';

import { organizationAdapter } from './identity.adapter';

@Injectable()
export class OrganizationIdentityService {
  constructor(
    @Inject(UserService)
    private readonly user: UserService,
    @Inject(IdentityClient)
    private readonly identityClient: IdentityClient
  ) {}

  public async getAll(creatorID: number): Promise<Organization[]> {
    const token = await this.user.getTokenByID(creatorID);

    const allOrganizations = (await this.identityClient.organization.findManyByUserIDThroughWorkspaces(
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
      betaFlag: w.betaFlag ?? null,
    }));
  }
}
