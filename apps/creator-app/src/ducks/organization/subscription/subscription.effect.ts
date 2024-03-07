import { Utils } from '@voiceflow/common';
import { Subscription } from '@voiceflow/dtos';
import { PlanType } from '@voiceflow/internal';
import { Actions } from '@voiceflow/sdk-logux-designer';
import { toast } from '@voiceflow/ui';

import { designerClient } from '@/client/designer';
import { waitAsync } from '@/ducks/utils';
import { ChargebeeSubscriptionStatus } from '@/models';
import { Thunk } from '@/store/types';
import { getErrorMessage } from '@/utils/error';

import { chargebeeSubscriptionSelector } from './subscription.select';

export const checkout = (
  organizationID: string,
  subscriptionID: string,
  data: Omit<Actions.OrganizationSubscription.CheckoutRequest, 'context'>
): Thunk<void> => {
  const { itemPriceID, planPrice, editorSeats, period, paymentIntent } = data;

  return async (dispatch) => {
    try {
      const newSubscription = await dispatch(
        waitAsync(Actions.OrganizationSubscription.Checkout, {
          editorSeats,
          itemPriceID,
          period,
          planPrice,
          paymentIntent,
          context: { organizationID, subscriptionID },
        })
      );

      dispatch.local(Actions.OrganizationSubscription.Replace({ subscription: newSubscription, context: { organizationID, subscriptionID } }));

      toast.success(`Upgraded to ${Utils.string.capitalizeFirstLetter(newSubscription.plan)}!`);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to checkout'));
    }
  };
};

export const loadActiveOrganizationSubscription =
  (organizationID: string, chargebeeSubscriptionID: string): Thunk<Subscription | null> =>
  async (dispatch) => {
    try {
      const subscription = (await designerClient.billing.subscription.findOne(organizationID, chargebeeSubscriptionID)) as Subscription;

      await dispatch.local(Actions.OrganizationSubscription.Replace({ subscription, context: { organizationID } }));

      return subscription;
    } catch {
      return null;
    }
  };

export const cancelSubscription = (organizationID: string, chargebeeSubscriptionID: string): Thunk<void> => {
  return async (dispatch, getState) => {
    const subscription = chargebeeSubscriptionSelector(getState());

    if (!subscription) return;
    try {
      await designerClient.billing.subscription.cancel(organizationID, chargebeeSubscriptionID);

      await dispatch.local(
        Actions.OrganizationSubscription.Replace({
          subscription: {
            ...subscription,
            status: ChargebeeSubscriptionStatus.NON_RENEWING,
          },
          context: { organizationID },
        })
      );
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to cancel subscription'));
    }
  };
};

export const downgradeTrial = (organizationID: string, chargebeeSubscriptionID: string): Thunk<void> => {
  return async (dispatch, getState) => {
    try {
      const subscription = chargebeeSubscriptionSelector(getState());

      if (!subscription) return;

      await designerClient.billing.subscription.downgradeTrial(organizationID, chargebeeSubscriptionID);

      await dispatch.local(
        Actions.OrganizationSubscription.Replace({
          subscription: {
            ...subscription,
            plan: PlanType.STARTER,
            trial: null,
          },
          context: { organizationID },
        })
      );
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to downgrade trial'));
    }
  };
};
