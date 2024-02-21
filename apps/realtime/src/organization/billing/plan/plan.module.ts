import { Module } from '@nestjs/common';

import { BillingPlanHTTPController } from './plan.http.controller';
import { BillingPlanService } from './plan.service';

@Module({
  providers: [BillingPlanService],
  controllers: [BillingPlanHTTPController],
  exports: [BillingPlanService],
})
export class BillingPlanModule {}
