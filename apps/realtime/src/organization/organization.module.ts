import { Module } from '@nestjs/common';

import { OrganizationBillingModule } from './billing/billing.module';
import { OrganizationHTTPController } from './organization.http.controller';
import { OrganizationLoguxController } from './organization.logux.controller';
import { OrganizationService } from './organization.service';
import { OrganizationMemberService } from './organization-member.service';

@Module({
  imports: [OrganizationBillingModule],
  providers: [OrganizationService, OrganizationMemberService],
  controllers: [OrganizationHTTPController, OrganizationLoguxController],
})
export class OrganizationModule {}
