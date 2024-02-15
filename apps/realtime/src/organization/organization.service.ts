import { Inject, Injectable } from '@nestjs/common';
import { Organization } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { IdentityClient } from '@voiceflow/sdk-identity';

import { organizationAdapter } from './organization.adapter';

@Injectable()
export class OrganizationService {
  constructor(@Inject(IdentityClient) private readonly identityClient: IdentityClient) {}

  public async getAll(): Promise<Organization[]> {
    const allOrganizations = (await this.identityClient.organization.findManyByUserID({
      members: true,
      trial: true,
      subscription: true,
    })) as Realtime.Identity.Organization[];
    return organizationAdapter.mapFromDB(allOrganizations);
  }

  public async patchOne(organizationID: string, values: Partial<Organization>): Promise<void> {
    await this.identityClient.organization.patchOne(organizationID, values);
  }

  public async getWorkspaces(organizationID: string): Promise<Realtime.Identity.Workspace[]> {
    // This method returns all workspaces for an organization
    // TODO [organization refactor] create adapter for workspaces
    return (await this.identityClient.organization.findAllByOrganizationID(organizationID)).map((w) => ({
      id: w.id,
      name: w.name,
      image: w.image || '',
      settings: w.settings,
      organizationID: w.organizationID,
      createdAt: w.createdAt,
      updatedAt: w.updatedAt,
    }));
  }
}
