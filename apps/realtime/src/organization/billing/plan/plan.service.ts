import { Inject, Injectable } from '@nestjs/common';
import { BillingPlan } from '@voiceflow/dtos';
import { BillingPeriod, PlanType } from '@voiceflow/internal';
import { BillingClient } from '@voiceflow/sdk-billing';

import { ChargebeePlan, PlanItemPrice } from './plan.types';

@Injectable()
export class BillingPlanService {
  constructor(@Inject(BillingClient) private readonly billingClient: BillingClient) {}

  private async getPlanEstimateAmount(itemPrice: PlanItemPrice, coupon?: string): Promise<number> {
    const response = await this.billingClient.estimatesPrivate
      .createSubscriptionEstimation({
        json: {
          subscription_items: [
            {
              item_price_id: itemPrice.id,
              quantity: 1,
            },
          ],
          coupon_ids: coupon && [coupon],
        },
      })
      .catch(() => null);

    const estimate = response?.estimate.invoice_estimate?.line_items?.[0];
    const discount = estimate?.discount_amount ?? 0;
    const originalAmount = estimate?.amount ?? itemPrice.price;

    return originalAmount - discount;
  }

  async getAllPlans(plan: PlanType, coupon?: string): Promise<BillingPlan[]> {
    const response = await this.billingClient.itemsPrivate.getItems({ type: 'plan' });
    const items = response.items as ChargebeePlan[];

    return Promise.all(
      items
        .filter((item) => item.id === plan)
        .map(async (item) => {
          const prices = await Promise.all(
            item.item_prices.map(async (price) => {
              const amount = await this.getPlanEstimateAmount(price, coupon);

              return {
                id: price.id,
                amount,
                period: price.period_unit === 'month' ? BillingPeriod.MONTHLY : BillingPeriod.ANNUALLY,
              };
            })
          );

          return {
            id: item.id,
            name: item.name,
            prices,
          };
        })
    );
  }
}
