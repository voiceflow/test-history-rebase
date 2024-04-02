import { Inject, Injectable } from '@nestjs/common';
import { HashedIDService } from '@voiceflow/nestjs-common';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { BillingClient } from '@voiceflow/sdk-billing';
import { SubscriptionsControllerGetSubscription200Subscription } from '@voiceflow/sdk-billing/generated';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { UserService } from '@/user/user.service';

import subscriptionAdapter from './adapters/subscription.adapter';
import { pollWithProgressiveTimeout } from './subscription.utils';

const fromUnixTimestamp = (timestamp: number) => timestamp * 1000;

@Injectable()
export class BillingSubscriptionService {
  constructor(
    @Inject(BillingClient)
    private readonly billingClient: BillingClient,
    @Inject(LoguxService)
    private readonly logux: LoguxService,
    @Inject(UserService)
    private readonly user: UserService,
    @Inject(HashedIDService)
    private readonly hashedID: HashedIDService
  ) {}

  private parseSubscription(subscription: SubscriptionsControllerGetSubscription200Subscription): Realtime.Identity.Subscription {
    return {
      id: subscription.id,
      status: subscription.status,
      onDunningPeriod: subscription.on_dunning_period,
      startDate: subscription.start_date ? fromUnixTimestamp(subscription.start_date) : undefined,
      currentTermStart: subscription.current_term_start ? fromUnixTimestamp(subscription.current_term_start) : undefined,
      currentTermEnd: subscription.current_term_end ? fromUnixTimestamp(subscription.current_term_end) : undefined,
      nextBillingAt: subscription.next_billing_at ? fromUnixTimestamp(subscription.next_billing_at) : undefined,
      billingPeriodUnit: subscription.billing_period_unit,
      trialStart: subscription.trial_start ? fromUnixTimestamp(subscription.trial_start) : undefined,
      trialEnd: subscription.trial_end ? fromUnixTimestamp(subscription.trial_end) : undefined,
      cancelledAt: subscription.cancelled_at ? fromUnixTimestamp(subscription.cancelled_at) : undefined,
      cancelReason: subscription.cancel_reason,
      resourceVersion: subscription.resource_version,
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
      paymentSource: subscription.payment_source as Realtime.Identity.SubscriptionPaymentSource,
      customer: subscription.customer && {
        cfOrganizationID: subscription.customer.cf_organization_id,
      },
      // TODO: remove this as any when platform fix types
      customerID: (subscription as any).customer_id,
      subscriptionEntitlements: subscription.subscription_entitlements?.map((item) => ({
        featureID: item.feature_id,
        value: item.value,
      })),
      metaData: subscription.meta_data,
    };
  }

  async findOne(subscriptionID: string) {
    const { subscription } = await this.billingClient.subscriptionsPrivate.getSubscription(subscriptionID);

    return this.parseSubscription(subscription);
  }

  async findOneByOrganizationID(organizationID: string) {
    const orgID = this.hashedID.decodeWorkspaceID(organizationID);
    const { subscription } = await this.billingClient.organizationsPrivate.getOrganizationSubscription(orgID);
    return this.parseSubscription(subscription);
  }

  getInvoices(subscriptionID: string, { cursor, limit }: { cursor?: string; limit?: number } = {}) {
    return this.billingClient.subscriptionsPrivate.getSubscriptionInvoices(subscriptionID, { ...(cursor && { cursor }), ...(limit && { limit }) });
  }

  async cancel(subscriptionID: string) {
    await this.billingClient.subscriptionsPrivate.cancelSubscription(subscriptionID, { end_of_term: true });

    // TODO: remove it once we implement event subscription
    await this.waitForSubscriptionUpdate(subscriptionID);

    return this.findOne(subscriptionID);
  }

  private async waitForSubscriptionUpdate(subscriptionID: string, timeout = 10000, interval = 1000) {
    const { resourceVersion } = await this.findOne(subscriptionID);

    return pollWithProgressiveTimeout(
      async () => {
        const subscription = await this.findOne(subscriptionID);
        if (!resourceVersion || !subscription.resourceVersion) return true;

        return subscription.resourceVersion > resourceVersion;
      },
      timeout,
      interval,
      0.2
    );
  }

  async createPaymentIntent(userID: number, amount: number) {
    const token = await this.user.getTokenByID(userID);
    return this.billingClient.paymentIntentsPrivate.createPaymentIntent({ amount, currency_code: 'USD' }, { headers: { Authorization: token } });
  }

  async updateCustomerCard(customerID: string, paymentIntentID: string) {
    return this.billingClient.customersPrivate.createCustomerCard(customerID, {
      json: {
        paymentIntentID,
      },
    });
  }

  async checkoutAndBroadcast(
    authPayload: AuthMetaPayload,
    organizationID: string,
    data: Omit<Actions.OrganizationSubscription.CheckoutRequest, 'context'>
  ) {
    const subscription = await this.findOneByOrganizationID(organizationID);

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    try {
      await this.billingClient.subscriptionsPrivate.checkout(subscription.id, {
        subscriptionItems: [
          {
            itemPriceID: data.itemPriceID,
            quantity: 1,
          },
        ],

        paymentIntentID: data.paymentIntent.id,

        trialEnd: 0,
        changeOption: 'immediately',

        ...(subscription.metaData?.downgradedFromTrial
          ? {
              metadata: {
                ...subscription.metaData,
                downgradedFromTrial: false,
              },
            }
          : {}),
      });
    } catch (e) {
      throw new Error('Unable to update subscription');
    }

    // TODO: remove it once we implement event subscription
    await this.waitForSubscriptionUpdate(subscription.id);

    const newSubscription = await this.findOneByOrganizationID(organizationID).then(subscriptionAdapter.fromDB);

    // TODO: fix broadcast not working
    await this.logux.processAs(
      Actions.OrganizationSubscription.Replace({
        subscription: newSubscription,
        context: { organizationID },
      }),
      authPayload
    );

    return newSubscription;
  }

  async downgradeTrial(subscriptionID: string) {
    const subscription = await this.findOne(subscriptionID);

    await this.billingClient.subscriptionsPrivate.patchSubscription(subscriptionID, {
      metadata: {
        ...subscription.metaData,
        downgradedFromTrial: false,
      },
    });

    // TODO: remove it once we implement event subscription
    await this.waitForSubscriptionUpdate(subscriptionID);

    return this.findOne(subscriptionID);
  }
}
