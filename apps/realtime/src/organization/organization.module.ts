import { Module } from '@nestjs/common';

import { OrganizationBillingModule } from './billing/billing.module';
import { OrganizationService } from './organization.service';
import { OrganizationMemberService } from './organization-member.service';

@Module({
  imports: [OrganizationBillingModule],
  providers: [OrganizationService, OrganizationMemberService],
})
export class OrganizationModule {}
