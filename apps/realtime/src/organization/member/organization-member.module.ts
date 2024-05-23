import { Module } from '@nestjs/common';

import { OrganizationMemberService } from './organization-member.service';

@Module({
  providers: [OrganizationMemberService],
  exports: [OrganizationMemberService],
})
export class OrganizationMemberModule {}
