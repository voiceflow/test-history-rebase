import { Inject, Injectable } from '@nestjs/common';
import { BillingPlan } from '@voiceflow/dtos';
import { BillingPeriod } from '@voiceflow/internal';
import { BillingClient } from '@voiceflow/sdk-billing';

import { ChargebeePlan } from './billing.types';

@Injectable()
export class BillingService {
  constructor(@Inject(BillingClient) private readonly billingClient: BillingClient) {}

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
}
