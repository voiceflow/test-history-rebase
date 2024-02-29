import { Module } from '@nestjs/common';

import { OrganizationBillingModule } from './billing/billing.module';
import { BillingSubscriptionModule } from './billing/subscription/subscription.module';
import { OrganizationIdentityModule } from './identity/identity.module';
import { OrganizationIdentityService } from './identity/identity.service';
import { OrganizationIdentityMemberService } from './identity/member.service';
import { OrganizationHTTPController } from './organization.http.controller';
import { OrganizationLoguxController } from './organization.logux.controller';

@Module({
  imports: [OrganizationBillingModule, BillingSubscriptionModule, OrganizationIdentityModule],
  providers: [OrganizationIdentityService, OrganizationIdentityMemberService],
  controllers: [OrganizationHTTPController, OrganizationLoguxController],
  exports: [OrganizationIdentityService],
})
export class OrganizationModule {}
