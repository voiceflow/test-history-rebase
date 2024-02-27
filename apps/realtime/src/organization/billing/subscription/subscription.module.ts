import { Module } from '@nestjs/common';

import { BillingSubscriptionHTTPController } from './subscription.http.controller';
import { BillingSubscriptionService } from './subscription.service';

@Module({
  providers: [BillingSubscriptionService],
  controllers: [BillingSubscriptionHTTPController],
  exports: [BillingSubscriptionService],
})
export class BillingSubscriptionModule {}
