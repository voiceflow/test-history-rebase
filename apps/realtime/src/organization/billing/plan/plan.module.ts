import { Module } from '@nestjs/common';

import { BillingPlanHTTPController } from './plan.http.controller';
import { BillingPlanService } from './plan.service';

@Module({
  controllers: [BillingPlanHTTPController],
  providers: [BillingPlanService],
})
export class BillingPlanModule {}
