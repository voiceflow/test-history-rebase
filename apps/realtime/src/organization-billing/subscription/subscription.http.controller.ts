import { Controller, Get, HttpStatus, Inject, Param, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Subscription, SubscriptionDTO } from '@voiceflow/dtos';
import { ZodApiQuery, ZodApiResponse } from '@voiceflow/nestjs-common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';

import { invoiceAdapter } from './adapters/invoice.adapter';
import { GetInvoicesRequestQuery } from './dto/get-invoices-request.dto';
import { GetInvoicesResponse } from './dto/get-invoices-response.dto';
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
  @ApiParam({ name: 'organizationID', type: 'string' })
  @ApiParam({ name: 'subscriptionID', type: 'string' })
  @ZodApiResponse({ status: HttpStatus.OK, schema: SubscriptionDTO })
  async findOne(@Param('subscriptionID') subscriptionID: string): Promise<Subscription> {
    return this.service.findOne(subscriptionID).then(Realtime.Adapters.Billing.subscription.fromDB);
  }

  @Get(':subscriptionID/invoices')
  @Authorize.Permissions([Permission.ORGANIZATION_READ])
  @ApiOperation({
    summary: 'Returns billing subscription invoices',
    description: 'Returns billing subscription invoices for the given subscriptionID',
  })
  @ApiParam({ name: 'organizationID', type: 'string' })
  @ApiParam({ name: 'subscriptionID', type: 'string' })
  @ZodApiQuery({ schema: GetInvoicesRequestQuery })
  @ZodApiResponse({ status: HttpStatus.OK, schema: GetInvoicesResponse })
  async getInvoices(@Param('subscriptionID') subscriptionID: string, @Query() query: GetInvoicesRequestQuery): Promise<GetInvoicesResponse> {
    const { invoices, nextCursor, hasMore } = await this.service.getInvoices(subscriptionID, { cursor: query.cursor, limit: query.limit });

    const invoicesResponse = invoices.map(invoiceAdapter.fromDB);

    return {
      invoices: invoicesResponse,
      nextCursor,
      hasMore,
    };
  }

  @Put(':subscriptionID/cancel')
  @Authorize.Permissions([Permission.ORGANIZATION_UPDATE])
  @ApiOperation({
    summary: 'Cancels billing subscription',
    description: 'Cancels billing subscription for the given subscriptionID',
  })
  @ApiParam({ name: 'organizationID', type: 'string' })
  @ApiParam({ name: 'subscriptionID', type: 'string' })
  @ZodApiResponse({ status: HttpStatus.OK })
  async cancel(@Param('subscriptionID') subscriptionID: string): Promise<void> {
    await this.service.cancel(subscriptionID);
  }
}
