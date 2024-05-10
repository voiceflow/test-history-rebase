import { Body, Controller, Get, HttpStatus, Inject, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { PaymentIntent, PaymentIntentDTO, Subscription, SubscriptionDTO, SubscriptionPaymentMethodStatusType } from '@voiceflow/dtos';
import { ZodApiBody, ZodApiQuery, ZodApiResponse } from '@voiceflow/nestjs-common';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize, UserID } from '@voiceflow/sdk-auth/nestjs';
import type { Request } from 'express';
import { ZodValidationPipe } from 'nestjs-zod';

import { invoiceAdapter } from './adapters/invoice.adapter';
import subscriptionAdapter from './adapters/subscription.adapter';
import { CreatePaymentIntentRequest } from './dto/create-payment-intent-request.dto';
import { GetInvoicesRequestQuery } from './dto/get-invoices-request.dto';
import { GetInvoicesResponse } from './dto/get-invoices-response.dto';
import { UpsertCustomerCardRequest } from './dto/upsert-customer-card-request.dto';
import { UpsertCustomerCardResponse } from './dto/upsert-customer-card-response.dto';
import { BillingSubscriptionService } from './subscription.service';

@Controller(':organizationID/billing/subscription')
@ApiTags('Billing/Subscription')
export class BillingSubscriptionHTTPController {
  constructor(
    @Inject(BillingSubscriptionService)
    private readonly service: BillingSubscriptionService
  ) {}

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
  @ZodApiResponse({ status: HttpStatus.OK, schema: SubscriptionDTO })
  async cancel(@Param('subscriptionID') subscriptionID: string): Promise<Subscription> {
    return this.service.cancel(subscriptionID).then(subscriptionAdapter.fromDB);
  }

  @Put(':subscriptionID/downgrade-trial')
  @Authorize.Permissions([Permission.ORGANIZATION_UPDATE])
  @ApiOperation({
    summary: 'Downgrade trial subscription to starter plan',
    description: 'Downgrade trial subscription to starter plan for the given subscriptionID',
  })
  @ApiParam({ name: 'organizationID', type: 'string' })
  @ApiParam({ name: 'subscriptionID', type: 'string' })
  @ZodApiResponse({ status: HttpStatus.OK, schema: SubscriptionDTO })
  async downgradeTrial(@Param('subscriptionID') subscriptionID: string): Promise<Subscription> {
    return this.service.downgradeTrial(subscriptionID).then(subscriptionAdapter.fromDB);
  }

  @Post('payment-intent')
  @Authorize.Permissions([Permission.ORGANIZATION_UPDATE])
  @ApiOperation({
    summary: 'Create payment intent',
    description: 'Create payment intent',
  })
  @ApiParam({ name: 'organizationID', type: 'string' })
  @ApiParam({ name: 'subscriptionID', type: 'string' })
  @ZodApiResponse({ status: HttpStatus.OK, schema: PaymentIntentDTO })
  @ZodApiBody({ schema: CreatePaymentIntentRequest })
  async createPaymentIntent(
    @UserID() userID: number,
    @Body(new ZodValidationPipe(CreatePaymentIntentRequest))
    paymentIntentRequest: CreatePaymentIntentRequest
  ): Promise<PaymentIntent> {
    const { payment_intent } = await this.service.createPaymentIntent(userID, paymentIntentRequest);

    return {
      ...payment_intent,
      amount: payment_intent.amount,
      createdAt: payment_intent.created_at,
      currencyCode: payment_intent.currency_code ?? 'USD',
      expiresAt: payment_intent.expires_at,
      gateway: payment_intent.gateway ?? 'chargebee',
      gatewayAccountId: payment_intent.gateway_account_id,
      id: payment_intent.id,
      modifiedAt: payment_intent.modified_at,
      paymentMethodType: payment_intent.payment_method_type ?? 'card',
      status: payment_intent.status,
      referenceID: payment_intent.reference_id ?? '',
    };
  }

  @Post('card')
  @Authorize.Permissions([Permission.ORGANIZATION_UPDATE])
  @ApiOperation({
    summary: 'Create or update customer card',
    description: 'Create or update customer card',
  })
  @ApiParam({ name: 'organizationID', type: 'string' })
  @ZodApiBody({ schema: UpsertCustomerCardRequest })
  @ZodApiResponse({ status: HttpStatus.OK, schema: UpsertCustomerCardResponse })
  async upsertCustomerCard(
    @Body(new ZodValidationPipe(UpsertCustomerCardRequest))
    paymentIntentRequest: UpsertCustomerCardRequest
  ): Promise<UpsertCustomerCardResponse> {
    const data = await this.service.updateCustomerCard(paymentIntentRequest.customerID, paymentIntentRequest.paymentIntentID);
    const { card, reference_id } = data.payment_source;

    if (!card) {
      throw new Error('Card not created');
    }

    return {
      paymentMethod: {
        referenceID: reference_id,
        card: {
          brand: card.brand,
          last4: card.last4,
          expiryMonth: card.expiry_month,
          expiryYear: card.expiry_year,
          iin: card.iin,
          maskedNumber: card.masked_number ?? '',
        },
        billingAddress: {
          billingAddr1: card.billing_addr1 ?? '',
          billingCity: card.billing_city ?? '',
          billingState: card.billing_state ?? '',
          billingStateCode: card.billing_state_code ?? '',
          billingCountry: card.billing_country ?? '',
        },
        failed: data.payment_source.status === 'failed',
        id: data.payment_source.id,
        status: data.payment_source.status as SubscriptionPaymentMethodStatusType,
      },
    };
  }

  // keep as the last route to avoid collisions
  @Get(':subscriptionID/:workspaceID')
  @Authorize.Permissions<Request<{ workspaceID: string }>>([Permission.ORGANIZATION_READ], (request) => ({
    id: request.params.workspaceID,
    kind: 'workspace',
  }))
  @ApiOperation({
    summary: 'Returns billing subscription',
    description: 'Returns billing subscription for the given subscriptionID',
  })
  @ApiParam({ name: 'organizationID', type: 'string' })
  @ApiParam({ name: 'subscriptionID', type: 'string' })
  @ApiParam({ name: 'workspaceID', type: 'string' })
  @ZodApiResponse({ status: HttpStatus.OK, schema: SubscriptionDTO })
  async findOne(@Param('subscriptionID') subscriptionID: string): Promise<Subscription> {
    return this.service.findOne(subscriptionID).then(subscriptionAdapter.fromDB);
  }
}
