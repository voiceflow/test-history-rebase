import { Module } from '@nestjs/common';

import { BillingSubscriptionHTTPController } from './subscription.http.controller';
import { BillingSubscriptionLoguxController } from './subscription.logux.controller';
import { BillingSubscriptionService } from './subscription.service';

@Module({
  providers: [BillingSubscriptionService],
  controllers: [BillingSubscriptionHTTPController, BillingSubscriptionLoguxController],
  exports: [BillingSubscriptionService],
})
export class BillingSubscriptionModule {}
