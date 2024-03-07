import { Inject, Injectable } from '@nestjs/common';
import { IdentityClient } from '@voiceflow/sdk-identity';

import { UserService } from '@/user/user.service';

@Injectable()
export class OrganizationIdentityMemberService {
  constructor(
    @Inject(IdentityClient) private readonly identityClient: IdentityClient,
    @Inject(UserService)
    private readonly user: UserService
  ) {}

  public async getAll(organizationID: string) {
    return this.identityClient.organizationMember.findAll(organizationID);
  }

  public async add(organizationID: string, memberID: number): Promise<void> {
    return this.identityClient.organizationMember.addMember(organizationID, { userID: memberID });
  }

  public async remove(userID: number, organizationID: string, memberID: number): Promise<void> {
    const token = await this.user.getTokenByID(userID);
    return this.identityClient.organizationMember.deleteMember(organizationID, memberID, { headers: { Authorization: token } });
  }

  public async removeSelf(organizationID: string): Promise<void> {
    return this.identityClient.organizationMember.leaveWorkspace(organizationID);
  }
}
