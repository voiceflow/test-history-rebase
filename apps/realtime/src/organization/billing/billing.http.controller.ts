import { Controller, Get, HttpStatus, Inject } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BillingPlan } from '@voiceflow/dtos';
import { ZodApiResponse } from '@voiceflow/nestjs-common';

import { BillingService } from './billing.service';
import { GetBillingPlansResponse } from './dtos/get-plans.dto';

@Controller('/billing')
@ApiTags('Billing')
export class BillingHTTPController {
  constructor(
    @Inject(BillingService)
    private readonly service: BillingService
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
