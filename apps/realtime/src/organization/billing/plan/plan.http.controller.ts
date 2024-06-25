import { Controller, Get, HttpStatus, Inject, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BillingPlan, PlanName, PlanNameDTO } from '@voiceflow/dtos';
import { ZodApiQuery, ZodApiResponse } from '@voiceflow/nestjs-common';
import { z } from 'nestjs-zod/z';

import { GetBillingPlansResponse } from './dtos/get-billing-plans-response.dto';
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
  @ApiQuery({
    name: 'coupon',
    required: false,
    description: 'Coupon code',
  })
  @ZodApiQuery({
    name: 'planIDs',
    description: 'List of plan IDs',
    schema: z.array(PlanNameDTO),
  })
  @ZodApiResponse({ status: HttpStatus.OK, schema: GetBillingPlansResponse })
  async getPlans(
    @Query('planIDs') planIDs: PlanName[],
    @Query('coupon') coupon?: string | undefined
  ): Promise<BillingPlan[]> {
    return this.service.getPlans(planIDs, coupon);
  }
}
