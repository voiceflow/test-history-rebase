import { Module } from '@nestjs/common';

import { BillingSubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [BillingSubscriptionModule],
})
export class OrganizationBillingModule {}
