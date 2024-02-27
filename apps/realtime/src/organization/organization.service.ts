import { Inject, Injectable } from '@nestjs/common';
import { Organization } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { IdentityClient } from '@voiceflow/sdk-identity';

import { UserService } from '@/user/user.service';

import { organizationAdapter } from './organization.adapter';

@Injectable()
export class OrganizationService {
  constructor(
    @Inject(UserService)
    private readonly user: UserService,
    @Inject(IdentityClient)
    private readonly identityClient: IdentityClient
  ) {}

  public async getAll(creatorID: number): Promise<Organization[]> {
    const token = await this.user.getTokenByID(creatorID);

    const allOrganizations = (await this.identityClient.organization.findManyByUserID(
      {
        members: true,
        trial: true,
        subscription: true,
      },
      {
        headers: { Authorization: token },
      }
    )) as Realtime.Identity.Organization[];

    return organizationAdapter.mapFromDB(allOrganizations);
  }

  public async patchOne(creatorID: number, organizationID: string, values: Partial<Organization>): Promise<void> {
    const token = await this.user.getTokenByID(creatorID);

    await this.identityClient.organization.patchOne(organizationID, values, {
      headers: { Authorization: token },
    });
  }

  public async getWorkspaces(creatorID: number, organizationID: string): Promise<Realtime.Identity.Workspace[]> {
    const token = await this.user.getTokenByID(creatorID);

    // This method returns all workspaces for an organization
    // TODO [organization refactor] create adapter for workspaces
    return (await this.identityClient.organization.findAllByOrganizationID(organizationID)).map(
      (w) => ({
        id: w.id,
        name: w.name,
        image: w.image || '',
        settings: w.settings,
        organizationID: w.organizationID,
        createdAt: w.createdAt,
        updatedAt: w.updatedAt,
      }),
      { headers: { Authorization: token } }
    );
  }
}
