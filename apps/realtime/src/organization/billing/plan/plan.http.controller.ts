import { Controller, Get, HttpStatus, Inject, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BillingPlan } from '@voiceflow/dtos';
import { PlanType } from '@voiceflow/internal';
import { ZodApiResponse } from '@voiceflow/nestjs-common';

import { GetBillingPlansResponse } from './dtos/get-plans.dto';
import { BillingPlanService } from './plan.service';

@Controller('/billing/plans')
@ApiTags('Billing/Plan')
export class BillingPlanHTTPController {
  constructor(
    @Inject(BillingPlanService)
    private readonly service: BillingPlanService
  ) {}

  @Get(':planID')
  @ApiOperation({
    summary: 'Get plan prices',
    description: 'Get all billing prices for given plan',
  })
  @ZodApiResponse({ status: HttpStatus.OK, schema: GetBillingPlansResponse })
  async getAllPlans(@Param('planID') planID: PlanType, @Query('coupon') coupon?: string | undefined): Promise<BillingPlan[]> {
    return this.service.getAllPlans(planID, coupon);
  }
}
