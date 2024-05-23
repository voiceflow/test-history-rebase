import { Module } from '@nestjs/common';

import { OrganizationBillingModule } from './billing/billing.module';
import { BillingSubscriptionModule } from './billing/subscription/subscription.module';
import { OrganizationMemberModule } from './member/organization-member.module';
import { OrganizationHTTPController } from './organization.http.controller';
import { OrganizationLoguxController } from './organization.logux.controller';
import { OrganizationService } from './organization.service';

@Module({
  imports: [OrganizationBillingModule, BillingSubscriptionModule, OrganizationMemberModule],
  providers: [OrganizationService],
  controllers: [OrganizationHTTPController, OrganizationLoguxController],
  exports: [OrganizationService],
})
export class OrganizationModule {}
