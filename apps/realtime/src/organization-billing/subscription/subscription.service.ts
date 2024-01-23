import { Inject, Injectable } from '@nestjs/common';
import { BillingClient } from '@voiceflow/sdk-billing';

const fromUnixTimestamp = (timestamp: number) => timestamp * 1000;

@Injectable()
export class BillingSubscriptionService {
  constructor(
    @Inject(BillingClient)
    private readonly billingClient: BillingClient
  ) {}

  async findOne(subscriptionID: string) {
    const subscription = await this.billingClient.private.getSubscription(subscriptionID);

    return {
      id: subscription.id,
      status: subscription.status,
      startDate: subscription.start_date ? fromUnixTimestamp(subscription.start_date) : undefined,
      currentTermStart: subscription.current_term_start ? fromUnixTimestamp(subscription.current_term_start) : undefined,
      currentTermEnd: subscription.current_term_end ? fromUnixTimestamp(subscription.current_term_end) : undefined,
      nextBillingAt: subscription.next_billing_at ? fromUnixTimestamp(subscription.next_billing_at) : undefined,
      billingPeriodUnit: subscription.billing_period_unit,
      trialStart: subscription.trial_start ? fromUnixTimestamp(subscription.trial_start) : undefined,
      trialEnd: subscription.trial_end ? fromUnixTimestamp(subscription.trial_end) : undefined,
      cancelledAt: subscription.cancelled_at ? fromUnixTimestamp(subscription.cancelled_at) : undefined,
      cancelReason: subscription.cancel_reason,
      subscriptionItems: subscription.subscription_items?.map((item) => ({
        itemPriceID: item.item_price_id,
        itemType: item.item_type,
        quantity: item.quantity ? Number(item.quantity) : undefined,
        quantityInDecimal: item.quantity_in_decimal,
        meteredQuantity: item.metered_quantity,
        lastCalculatedAt: item.last_calculated_at ? fromUnixTimestamp(item.last_calculated_at) : undefined,
        unitPrice: item.unit_price,
        unitPriceInDecimal: item.unit_price_in_decimal,
        amount: item.amount,
        amountInDecimal: item.amount_in_decimal,
        freeQuantity: item.free_quantity,
        freeQuantityInDecimal: item.free_quantity_in_decimal,
        trialEnd: item.trial_end ? fromUnixTimestamp(item.trial_end) : undefined,
        billingCycles: item.billing_cycles,
        servicePeriodDays: item.service_period_days,
        chargeOnEvent: item.charge_on_event,
        chargeOnce: item.charge_once,
        chargeOnOption: item.charge_on_option,
      })),
      paymentSource: subscription.payment_source,
      customer: subscription.customer && {
        cfOrganizationID: subscription.customer.cf_organization_id,
      },
      subscriptionEntitlements: subscription.subscription_entitlements?.map((item) => ({
        itemID: item.item_id,
        itemType: item.item_type,
        featureID: item.feature_id,
        featureName: item.feature_name,
        value: item.value,
        feature: item.feature,
      })),
    };
  }

  listInvoices(subscriptionID: string, { cursor, limit }: { cursor?: string; limit?: number } = {}) {
    return this.billingClient.private.getSubscriptionInvoices(subscriptionID, { cursor, limit });
  }
}
