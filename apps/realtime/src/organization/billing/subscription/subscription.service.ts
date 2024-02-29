import { Inject, Injectable } from '@nestjs/common';
import { BillingCheckoutPlan, CreditCard, Subscription } from '@voiceflow/dtos';
import { NotFoundException } from '@voiceflow/exception';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import { BillingClient } from '@voiceflow/sdk-billing';
import { SubscriptionsControllerGetSubscription200Subscription } from '@voiceflow/sdk-billing/generated';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { UserService } from '@/user/user.service';

import subscriptionAdapter from './adapters/subscription.adapter';
import { findPlanItem, pollWithProgressiveTimeout } from './subscription.utils';

const fromUnixTimestamp = (timestamp: number) => timestamp * 1000;

@Injectable()
export class BillingSubscriptionService {
  constructor(
    @Inject(BillingClient)
    private readonly billingClient: BillingClient,
    @Inject(UserService)
    private readonly user: UserService,
    @Inject(LoguxService)
    private readonly logux: LoguxService
  ) {}

  private parseSubscription(subscription: SubscriptionsControllerGetSubscription200Subscription) {
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
      // TODO: remove this as any when platform fix types
      customerID: (subscription as any).customer_id,
      subscriptionEntitlements: subscription.subscription_entitlements?.map((item) => ({
        itemID: item.item_id,
        itemType: item.item_type,
        featureID: item.feature_id,
        featureName: item.feature_name,
        value: item.value,
        feature: item.feature,
      })),
      metaData: subscription.meta_data,
      hasScheduledChanges: subscription.has_scheduled_changes,
    };
  }

  async findOne(subscriptionID: string) {
    const { subscription } = await this.billingClient.private.getSubscription(subscriptionID);

    return this.parseSubscription(subscription);
  }

  async getSubscriptionWithScheduledChanges(subscriptionID: string) {
    const { subscription } = await this.billingClient.private.getSubscriptionScheduledChanges(subscriptionID);

    return this.parseSubscription(subscription);
  }

  getInvoices(subscriptionID: string, { cursor, limit }: { cursor?: string; limit?: number } = {}) {
    return this.billingClient.private.getSubscriptionInvoices(subscriptionID, { ...(cursor && { cursor }), ...(limit && { limit }) });
  }

  cancel(subscriptionID: string) {
    return this.billingClient.private.cancelSubscription(subscriptionID);
  }

  async updateSeats(subscriptionID: string, editorSeats: number, changeOption: 'immediately' | 'end_of_term') {
    const subscription = await this.findOne(subscriptionID);

    const planItem = findPlanItem(subscription.subscriptionItems);

    if (!planItem) {
      throw new NotFoundException('Unable to update seats');
    }

    return this.billingClient.private.updateSubscriptionItem(subscriptionID, planItem.itemPriceID, {
      itemPriceID: planItem.itemPriceID,
      quantity: editorSeats,
      changeOption,
    });
  }

  async waitForSubscriptionStatus(subscriptionID: string, status: Subscription['status'], timeout = 10000, interval = 1000) {
    return pollWithProgressiveTimeout(
      async () => {
        const subscription = (await this.findOne(subscriptionID).then(subscriptionAdapter.fromDB)) as Subscription;
        return subscription.status === status;
      },
      timeout,
      interval,
      0.2
    );
  }

  async createCustomerCard(userID: number, subscription: Subscription, data: CreditCard) {
    if (!subscription.customerID) {
      throw new Error('Subscription customer not found');
    }

    const token = await this.user.getTokenByID(userID);

    return this.billingClient.private.createCustomerCard(subscription.customerID, {
      json: {
        first_name: data.firstName,
        last_name: data.lastName,
        number: data.number,
        expiry_month: data.expiryMonth,
        expiry_year: data.expiryYear,
        cvv: data.cvv,
        billing_addr1: data.billingAddr1,
        billing_city: data.billingCity,
        billing_state_code: data.billingState,
        billing_state: data.billingState,
        billing_country: data.billingCountry,
      },
      headers: { Authorization: token },
    });
  }

  // TODO: move checkout logic to billing service
  async checkoutAndBroadcast(
    authPayload: AuthMetaPayload,
    organizationID: string,
    subscriptionID: string,
    plan: BillingCheckoutPlan,
    card: CreditCard
  ) {
    const dbSubscription = await this.findOne(subscriptionID);
    const subscription = subscriptionAdapter.fromDB(dbSubscription);
    const planItem = findPlanItem(dbSubscription.subscriptionItems);

    if (!planItem) {
      throw new NotFoundException('Subscription plan not found');
    }

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    try {
      await this.createCustomerCard(authPayload.userID, subscription, card);
    } catch (e) {
      throw new Error('Unable to create customer card');
    }

    try {
      await this.billingClient.private.updateSubscriptionItem(subscriptionID, planItem.itemPriceID, {
        itemPriceID: plan.itemPriceID,
        quantity: plan.editorSeats,
        changeOption: 'immediately',
        trialEnd: 0,
      } as any);
    } catch (e) {
      throw new Error('Unable to update subscription');
    }

    // this not guarantee subscription payment success
    await this.waitForSubscriptionStatus(subscriptionID, 'active');

    const newSubscription = await this.findOne(subscriptionID).then(subscriptionAdapter.fromDB);

    // TODO: fix broadcast not working
    await this.logux.processAs(
      Actions.OrganizationSubscription.Replace({
        subscription: newSubscription,
        context: { organizationID, subscriptionID },
      }),
      authPayload
    );

    return newSubscription;
  }

  async downgradeTrial(subscriptionID: string) {
    const subscription = await this.findOne(subscriptionID);

    return this.billingClient.private.patchSubscription(subscriptionID, {
      metadata: {
        ...subscription.metaData,
        downgradedFromTrial: false,
      },
    });
  }
}
