import { Inject, Injectable } from '@nestjs/common';
import { OrganizationMember } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { IdentityClient } from '@voiceflow/sdk-identity';

import { UserService } from '@/user/user.service';

import { organizationMemberAdapter } from './organization-member.adapter';

@Injectable()
export class OrganizationMemberService {
  constructor(
    @Inject(IdentityClient) private readonly identityClient: IdentityClient,
    @Inject(UserService) private readonly user: UserService
  ) {}

  public async getAll(organizationID: string): Promise<OrganizationMember[]> {
    const result = await this.identityClient.private.getAllOrganizationMembers(organizationID);
    return organizationMemberAdapter.mapFromDB(result as Realtime.Identity.OrganizationMember[]);
  }

  public async remove(userID: number, organizationID: string, memberID: number): Promise<void> {
    return this.identityClient.organizationMember.deleteMember(organizationID, memberID, {
      headers: await this.user.getAuthHeadersByID(userID),
    });
  }
}
