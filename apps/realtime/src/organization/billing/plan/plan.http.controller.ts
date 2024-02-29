import { Controller, Get, HttpStatus, Inject } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BillingPlan } from '@voiceflow/dtos';
import { ZodApiResponse } from '@voiceflow/nestjs-common';

import { GetBillingPlansResponse } from './dtos/get-plans.dto';
import { BillingPlanService } from './plan.service';

@Controller('/billing/plan')
@ApiTags('Billing/Plan')
export class BillingPlanHTTPController {
  constructor(
    @Inject(BillingPlanService)
    private readonly service: BillingPlanService
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all billing plans',
    description: 'Get all available plans',
  })
  @ZodApiResponse({ status: HttpStatus.OK, schema: GetBillingPlansResponse })
  async getAllPlans(): Promise<BillingPlan[]> {
    return this.service.getAllPlans();
  }
}
