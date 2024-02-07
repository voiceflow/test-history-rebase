import { Inject, Injectable } from '@nestjs/common';
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
}
