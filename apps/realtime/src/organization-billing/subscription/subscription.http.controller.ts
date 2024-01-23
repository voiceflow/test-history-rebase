import { Controller, Get, HttpStatus, Inject, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { SubscriptionDTO } from '@voiceflow/dtos';
import { ZodApiResponse } from '@voiceflow/nestjs-common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';

import { BillingSubscriptionService } from './subscription.service';

@Controller(':organizationID/billing/subscription')
@ApiTags('Billing/Subscription')
export class BillingSubscriptionHTTPController {
  constructor(
    @Inject(BillingSubscriptionService)
    private readonly service: BillingSubscriptionService
  ) {}

  @Get(':subscriptionID')
  @Authorize.Permissions([Permission.ORGANIZATION_READ])
  @ApiOperation({
    summary: 'Returns billing subscription',
    description: 'Returns billing subscription for the given subscriptionID',
  })
  @ZodApiResponse({ status: HttpStatus.OK, schema: SubscriptionDTO })
  @ApiParam({ name: 'organizationID', type: 'string' })
  @ApiParam({ name: 'subscriptionID', type: 'string' })
  async findOne(@Param('subscriptionID') subscriptionID: string): Promise<SubscriptionDTO> {
    return this.service.findOne(subscriptionID).then(Realtime.Adapters.Billing.subscription.fromDB);
  }
}
