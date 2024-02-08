import { Body, Controller, Get, HttpStatus, Inject, Param, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Subscription, SubscriptionDTO } from '@voiceflow/dtos';
import { ZodApiBody, ZodApiQuery, ZodApiResponse } from '@voiceflow/nestjs-common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { ZodValidationPipe } from 'nestjs-zod';

import { invoiceAdapter } from './adapters/invoice.adapter';
import { GetInvoicesRequestQuery } from './dto/get-invoices-request.dto';
import { GetInvoicesResponse } from './dto/get-invoices-response.dto';
import { ScheduleSeatsUpdateRequest } from './dto/schedule-seats-update-request.dto';
import { UpdateSeatsRequest } from './dto/update-seats-request.dto';
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

  @Get(':subscriptionID/scheduled-changes')
  @Authorize.Permissions([Permission.ORGANIZATION_READ])
  @ApiOperation({
    summary: 'Returns billing subscription',
    description: 'Returns billing subscription for the given subscriptionID',
  })
  @ApiParam({ name: 'organizationID', type: 'string' })
  @ApiParam({ name: 'subscriptionID', type: 'string' })
  @ZodApiResponse({ status: HttpStatus.OK, schema: SubscriptionDTO })
  async getSubscriptionScheduledChanges(@Param('subscriptionID') subscriptionID: string): Promise<Subscription> {
    return this.service.getSubscriptionWithScheduledChanges(subscriptionID).then(Realtime.Adapters.Billing.subscription.fromDB);
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
    const { invoices, nextCursor } = await this.service.getInvoices(subscriptionID, { cursor: query.cursor, limit: query.limit });

    const invoicesResponse = invoices.map(invoiceAdapter.fromDB);

    return {
      invoices: invoicesResponse,
      nextCursor,
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

  @Put(':subscriptionID/schedule-seats')
  @Authorize.Permissions([Permission.ORGANIZATION_UPDATE])
  @ApiOperation({
    summary: 'Schedules billing subscription seats',
    description: 'Schedules billing subscription seats for the given subscriptionID',
  })
  @ApiParam({ name: 'organizationID', type: 'string' })
  @ApiParam({ name: 'subscriptionID', type: 'string' })
  @ZodApiBody({ schema: ScheduleSeatsUpdateRequest })
  @ZodApiResponse({ status: HttpStatus.OK })
  async scheduleSeatsUpdate(
    @Param('subscriptionID') subscriptionID: string,
    @Body(new ZodValidationPipe(ScheduleSeatsUpdateRequest)) data: ScheduleSeatsUpdateRequest
  ): Promise<void> {
    await this.service.updateSeats(subscriptionID, data.seats, 'end_of_term');
  }

  @Put(':subscriptionID/seats')
  @Authorize.Permissions([Permission.ORGANIZATION_UPDATE])
  @ApiOperation({
    summary: 'Schedules billing subscription seats',
    description: 'Schedules billing subscription seats for the given subscriptionID',
  })
  @ApiParam({ name: 'organizationID', type: 'string' })
  @ApiParam({ name: 'subscriptionID', type: 'string' })
  @ZodApiBody({ schema: UpdateSeatsRequest })
  @ZodApiResponse({ status: HttpStatus.OK })
  async updateSeats(
    @Param('subscriptionID') subscriptionID: string,
    @Body(new ZodValidationPipe(UpdateSeatsRequest)) data: UpdateSeatsRequest
  ): Promise<void> {
    await this.service.updateSeats(subscriptionID, data.seats, 'immediately');
  }
}
