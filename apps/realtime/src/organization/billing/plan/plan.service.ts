import { Inject, Injectable } from '@nestjs/common';
import { BillingPeriodUnit, BillingPlan, PlanName } from '@voiceflow/dtos';
import { BillingClient } from '@voiceflow/sdk-billing';

import { ChargebeePlan } from './plan.types';

const getMontlyAmount = (price: number, period: string) => (period === BillingPeriodUnit.YEAR ? price / 12 : price);
const getAnnualAmount = (price: number, period: string) => (period === BillingPeriodUnit.MONTH ? price * 12 : price);

export interface SubscriptionItem {
  itemPriceID: string;
  quantity: number;
}

@Injectable()
export class BillingPlanService {
  constructor(@Inject(BillingClient) private readonly billingClient: BillingClient) {}

  private async getPlanEstimateAmount(items: SubscriptionItem[], coupons?: string[]): Promise<number | null> {
    const response = await this.billingClient.estimatesPrivate
      .createSubscriptionEstimation({
        json: {
          subscription_items: items.map(({ itemPriceID, quantity }) => ({
            item_price_id: itemPriceID,
            quantity,
          })),

          coupon_ids: coupons,
        },
      })
      .catch(() => null);

    return response?.estimate.invoice_estimate?.total ?? null;
  }

  async getPlans(plans: PlanName[], coupons?: string[]): Promise<BillingPlan[]> {
    const response = await this.billingClient.itemsPrivate.getItems({ type: 'plan' });
    const items = response.items as ChargebeePlan[];

    const result = await Promise.all(
      items
        .filter((item) => plans.includes(item.id as PlanName))
        .map(async (item) => {
          const prices = await Promise.all(
            item.item_prices.map(async (itemPrice) => {
              const amount = !coupons?.length
                ? itemPrice.price
                : (await this.getPlanEstimateAmount(
                    [
                      {
                        itemPriceID: itemPrice.id,
                        quantity: 1,
                      },
                    ],
                    coupons
                  )) ?? itemPrice.price;

              return {
                id: itemPrice.id,
                amount,
                annualAmount: getAnnualAmount(amount, itemPrice.period_unit),
                monthlyAmount: getMontlyAmount(amount, itemPrice.period_unit),
                periodUnit: itemPrice.period_unit,
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
