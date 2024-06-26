import { Controller, Get, HttpStatus, Inject, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BillingPlan } from '@voiceflow/dtos';
import { ZodApiQuery, ZodApiResponse } from '@voiceflow/nestjs-common';

import { GetBillingPlansQuery } from './dtos/get-billing-plans.query.dto';
import { GetBillingPlansResponse } from './dtos/get-billing-plans.response';
import { BillingPlanService } from './plan.service';

@Controller('/billing/plans')
@ApiTags('Billing/Plan')
export class BillingPlanHTTPController {
  constructor(
    @Inject(BillingPlanService)
    private readonly service: BillingPlanService
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get plan prices',
    description: 'Get all billing prices for given plan',
  })
  @ZodApiQuery({
    description: 'List of plan IDs',
    schema: GetBillingPlansQuery,
  })
  @ZodApiResponse({ status: HttpStatus.OK, schema: GetBillingPlansResponse })
  async getPlans(@Query() query: GetBillingPlansQuery): Promise<BillingPlan[]> {
    return this.service.getPlans(query.planIDs, query.coupons);
  }
}
