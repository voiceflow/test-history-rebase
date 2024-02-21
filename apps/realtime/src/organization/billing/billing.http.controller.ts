import { Body, Controller, Get, HttpStatus, Inject, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BillingPlan } from '@voiceflow/dtos';
import { ZodApiResponse } from '@voiceflow/nestjs-common';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize, UserID } from '@voiceflow/sdk-auth/nestjs';
import { ZodValidationPipe } from 'nestjs-zod';

import { BillingService } from './billing.service';
import { GetBillingPlansResponse } from './dtos/get-plans.dto';
import { UpsertCreditCardRequest } from './dtos/upsert-credit-card.dto';

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

  @Post(':organizationID/card')
  @Authorize.Permissions([Permission.ORGANIZATION_UPDATE])
  @ApiOperation({
    summary: 'Create new billing plan',
    description: 'Create new billing plan',
  })
  async upsertCard(
    @UserID() userID: number,
    @Param('organizationID') organizationID: string,
    @Body(new ZodValidationPipe(UpsertCreditCardRequest)) data: UpsertCreditCardRequest
  ): Promise<void> {
    await this.service.upsertCard(userID, organizationID, data);
  }
}
