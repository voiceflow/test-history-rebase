import { Module } from '@nestjs/common';

import { OrganizationIdentityService } from './identity.service';
import { OrganizationIdentityMemberService } from './member.service';

@Module({
  providers: [OrganizationIdentityService, OrganizationIdentityMemberService],
  exports: [OrganizationIdentityService, OrganizationIdentityMemberService],
})
export class OrganizationIdentityModule {}
