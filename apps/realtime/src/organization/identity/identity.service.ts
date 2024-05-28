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
    const headers = await this.user.getAuthHeadersByID(creatorID);
    const allOrganizations = (await this.identityClient.organization.findManyByUserIDThroughWorkspaces(
      {
        trial: true,
      },
      {
        headers,
      }
    )) as Realtime.Identity.Organization[];

    const orgsWithMembers = await Promise.all(
      allOrganizations.map(async (o) => {
        const members = await this.identityClient.private.getAllOrganizationMembers(o.id, {
          headers,
        });

        return {
          ...o,
          members: members as unknown as Realtime.Identity.OrganizationMember[],
        };
      })
    );

    return organizationAdapter.mapFromDB(orgsWithMembers);
  }

  public async getOrganization(creatorID: number, organizationID: string): Promise<Organization | null> {
    const allOrganizations = await this.getAll(creatorID);
    return allOrganizations.find((o) => o.id === organizationID) || null;
  }

  public async patchOne(creatorID: number, organizationID: string, values: Partial<Organization>): Promise<void> {
    await this.identityClient.organization.patchOne(organizationID, values, {
      headers: await this.user.getAuthHeadersByID(creatorID),
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
