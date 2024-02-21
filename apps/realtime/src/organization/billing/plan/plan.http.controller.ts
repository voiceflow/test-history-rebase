import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BillingPlan } from '@voiceflow/dtos';

import { BillingPlanService } from './plan.service';

@Controller('billing/plan')
@ApiTags('Billing/Plan')
export class BillingPlanHTTPController {
  constructor(
    @Inject(BillingPlanService)
    private readonly service: BillingPlanService
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all billing plans',
    description: 'Get all billing plans for the given organizationID',
  })
  async getAllPlans(): Promise<BillingPlan[]> {
    return this.service.getAllPlans();
  }
}
