import { toast } from '@ui/components/Toast';
import { Utils } from '@voiceflow/common';
import { Subscription } from '@voiceflow/dtos';
import { BillingPeriod } from '@voiceflow/internal';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { designerClient } from '@/client/designer';
import { Thunk } from '@/store/types';
import { getErrorMessage } from '@/utils/error';

const pollWithProgressiveTimeout = (
  checkCondition: () => Promise<boolean>,
  initialDelay: number,
  maxDelay: number,
  increaseFactor: number, // This is a percentage increase factor for each iteration
  dampening = 0.95 // Dampening factor to slow down the increment rate over time
): Promise<void> =>
  new Promise<void>((resolve, reject) => {
    let currentDelay = initialDelay;

    const poll = () => {
      checkCondition()
        .then((conditionMet) => {
          // eslint-disable-next-line promise/always-return
          if (conditionMet) {
            resolve();
          } else {
            setTimeout(() => {
              // Calculate the next delay, applying the increase factor and dampening
              currentDelay = Math.min(currentDelay + currentDelay * increaseFactor * dampening, maxDelay);
              // Apply dampening for the next round
              // eslint-disable-next-line no-param-reassign
              dampening *= dampening;
              poll(); // Recursively call poll with updated delay
            }, currentDelay);
          }
        })
        .catch((error) => {
          reject(error);
        });
    };

    poll();
  });

export const checkout = (
  organizationID: string,
  subscriptionID: string,
  data: {
    itemPriceID: string;
    planPrice: number;
    editorSeats: number;
    period: BillingPeriod;
  }
): Thunk<void> => {
  const { itemPriceID, planPrice, editorSeats, period } = data;

  return async (dispatch) => {
    try {
      await designerClient.billing.subscription.checkout(organizationID, subscriptionID, {
        editorSeats,
        itemPriceID,
      });

      const plan = itemPriceID.split('-')[0];
      const pricePerEditor = planPrice / editorSeats;

      await pollWithProgressiveTimeout(
        async () => {
          const subscription = (await designerClient.billing.subscription.findOne(organizationID, subscriptionID)) as Subscription;
          return subscription.status === 'active';
        },
        1000,
        10000,
        0.2
      );

      const subscription = (await designerClient.billing.subscription.findOne(organizationID, subscriptionID)) as Subscription;

      if (subscription.status !== 'active') {
        await dispatch.local(
          Actions.OrganizationSubscription.Replace({
            subscription: {
              ...subscription,
              editorSeats,
              plan,
              status: 'active',
              planPrice,
              trial: null,
              pricePerEditor: period === BillingPeriod.MONTHLY ? pricePerEditor / 12 : pricePerEditor,
            },
            context: { organizationID },
          })
        );
      } else {
        await dispatch.local(
          Actions.OrganizationSubscription.Replace({
            subscription,
            context: { organizationID },
          })
        );
      }

      toast.success(`Upgraded to ${Utils.string.capitalizeFirstLetter(plan)}!`);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to checkout'));
    }
  };
};
