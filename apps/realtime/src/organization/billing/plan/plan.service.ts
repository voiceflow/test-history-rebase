import { Inject, Injectable } from '@nestjs/common';
import { BillingPeriodUnit, BillingPlan, PlanName } from '@voiceflow/dtos';
import { BillingClient } from '@voiceflow/sdk-billing';

import { ChargebeePlan, PlanItemPrice } from './plan.types';

const getMontlyAmount = (price: number, period: string) => (period === BillingPeriodUnit.YEAR ? price / 12 : price);
const getAnnualAmount = (price: number, period: string) => (period === BillingPeriodUnit.MONTH ? price * 12 : price);

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

  async getPlans(plans: PlanName[], coupon?: string): Promise<BillingPlan[]> {
    const response = await this.billingClient.itemsPrivate.getItems({ type: 'plan' });
    const items = response.items as ChargebeePlan[];

    const result = await Promise.all(
      items
        .filter((item) => plans.includes(item.id as PlanName))
        .map(async (item) => {
          const prices = await Promise.all(
            item.item_prices.map(async (price) => {
              const amount = !coupon ? price.price : await this.getPlanEstimateAmount(price, coupon);

              return {
                id: price.id,
                amount,
                annualAmount: getAnnualAmount(amount, price.period_unit),
                monthlyAmount: getMontlyAmount(amount, price.period_unit),
                periodUnit: price.period_unit,
              };
            })
          );

          const seatEntitlement = item.item_entitlements.find(({ feature_id }) => feature_id === 'limit-editor-count');
          const seats = seatEntitlement?.value ? Number(seatEntitlement.value) : 1;

          return {
            id: item.id,
            name: item.name.replace('Voiceflow -', '').trim(),
            description: item.description,
            pricesByPeriodUnit: Object.fromEntries(prices.map((price) => [price.periodUnit, price])),
            seats,
          } as BillingPlan;
        })
    );

    // sort based on plans filters
    return result.sort((a, b) => plans.indexOf(a.id) - plans.indexOf(b.id));
  }
}
