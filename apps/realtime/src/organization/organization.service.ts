import { Inject, Injectable } from '@nestjs/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { IdentityClient } from '@voiceflow/sdk-identity';

@Injectable()
export class OrganizationService {
  constructor(@Inject(IdentityClient) private readonly identityClient: IdentityClient) {}

  public async getAll() {
    return this.identityClient.organization.findManyByUserID({ members: true, trial: true, subscription: true });
  }

  public async updateName(organizationID: string, name: string) {
    return this.identityClient.organization.patchOne(organizationID, { name });
  }

  public async getWorkspaces(organizationID: string): Promise<Realtime.Identity.Workspace[]> {
    // This method returns all workspaces for an organization
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
