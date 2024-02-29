import { Inject, Injectable } from '@nestjs/common';
import { IdentityClient } from '@voiceflow/sdk-identity';

@Injectable()
export class OrganizationIdentityMemberService {
  constructor(@Inject(IdentityClient) private readonly identityClient: IdentityClient) {}

  public async getAll(organizationID: string) {
    return this.identityClient.organizationMember.findAll(organizationID);
  }

  public async add(organizationID: string, memberID: number): Promise<void> {
    return this.identityClient.organizationMember.addMember(organizationID, { userID: memberID });
  }

  public async remove(organizationID: string, memberID: number): Promise<void> {
    return this.identityClient.organizationMember.deleteMember(organizationID, memberID);
  }

  public async removeSelf(organizationID: string): Promise<void> {
    return this.identityClient.organizationMember.leaveWorkspace(organizationID);
  }
}
