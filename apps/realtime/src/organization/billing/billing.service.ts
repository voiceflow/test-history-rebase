import { Inject, Injectable } from '@nestjs/common';
import { BillingPlan } from '@voiceflow/dtos';
import { BillingPeriod } from '@voiceflow/internal';
import { BillingClient } from '@voiceflow/sdk-billing';

import { UserService } from '@/user/user.service';

import { OrganizationIdentityService } from '../identity/identity.service';
import { ChargebeePlan } from './billing.types';
import { UpsertCreditCardRequest } from './dtos/upsert-credit-card.dto';
import { BillingSubscriptionService } from './subscription/subscription.service';

@Injectable()
export class BillingService {
  constructor(
    @Inject(BillingClient) private readonly billingClient: BillingClient,
    @Inject(OrganizationIdentityService) private readonly organizationService: OrganizationIdentityService,
    @Inject(BillingSubscriptionService) private readonly subscriptionService: BillingSubscriptionService,
    @Inject(UserService) private readonly user: UserService
  ) {}

  async getAllPlans(): Promise<BillingPlan[]> {
    const response = await this.billingClient.private.getItems({ type: 'plan' });
    const items = response.items as ChargebeePlan[];

    return items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.item_prices.map((price) => ({
        id: price.id,
        price: price.price / 1000,
        period: price.period_unit === 'month' ? BillingPeriod.MONTHLY : BillingPeriod.ANNUALLY,
      })),
    }));
  }

  async upsertCard(userID: number, organizationID: string, data: UpsertCreditCardRequest) {
    const organization = await this.organizationService.getOrganization(userID, organizationID);

    if (!organization?.chargebeeSubscriptionID) {
      throw new Error('Organization has no subscription');
    }

    const subscription = await this.subscriptionService.findOne(organization.chargebeeSubscriptionID);

    if (!subscription.customerID) {
      throw new Error('Subscription customer not found');
    }

    const token = await this.user.getTokenByID(userID);

    return this.billingClient.private.createCustomerCard(subscription.customerID, {
      json: {
        first_name: data.firstName,
        last_name: data.lastLame,
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

  async createPaymentIntent(userID: number) {
    const token = await this.user.getTokenByID(userID);

    return this.billingClient.private.createPaymentIntent({ amount: 3005, currency_code: 'USD' }, { headers: { Authorization: token } });
  }
}
