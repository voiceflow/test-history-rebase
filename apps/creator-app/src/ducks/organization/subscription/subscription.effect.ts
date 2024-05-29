import { PlanName, Subscription } from '@voiceflow/dtos';
import { PlanType } from '@voiceflow/internal';
import { Actions } from '@voiceflow/sdk-logux-designer';
import { toast } from '@voiceflow/ui';

import { designerClient } from '@/client/designer';
import { PLAN_TYPE_META } from '@/constants';
import * as Tracking from '@/ducks/tracking';
import { waitAsync } from '@/ducks/utils';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { ChargebeeSubscriptionStatus } from '@/models';
import { Thunk } from '@/store/types';
import { getErrorMessage } from '@/utils/error';

import { chargebeeSubscriptionSelector, customerIDSelector } from './subscription.select';

export const checkout = (
  organizationID: string,
  workspaceID: string,
  data: Omit<Actions.OrganizationSubscription.CheckoutRequest, 'context'>
): Thunk<void> => {
  const { itemPriceID, paymentIntent } = data;

  return async (dispatch, getState) => {
    const subscription = chargebeeSubscriptionSelector(getState());

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    try {
      const newSubscription = await dispatch(
        waitAsync(Actions.OrganizationSubscription.Checkout, {
          itemPriceID,
          paymentIntent,
          couponIds: data.couponIds,
          context: { organizationID, workspaceID },
        })
      );

      const previousPlan =
        subscription.plan === PlanName.PRO && subscription.trial ? `${PlanName.PRO}-trial` : subscription.plan;

      dispatch(
        Tracking.trackSubscriptionModified({
          id: newSubscription.id,
          action: 'upgrade',
          period: newSubscription.billingPeriodUnit,
          newPlan: newSubscription.plan,
          previousPlan,
        })
      );

      toast.success(`Upgraded to ${PLAN_TYPE_META[newSubscription.plan].label}!`);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to checkout'));
    }
  };
};

export const loadSubscription =
  (organizationID: string, chargebeeSubscriptionID: string, workspaceID: string): Thunk<Subscription | null> =>
  async (dispatch) => {
    try {
      const subscription = (await designerClient.billing.subscription.findOne(
        organizationID,
        chargebeeSubscriptionID,
        workspaceID
      )) as Subscription;

      await dispatch.local(
        Actions.OrganizationSubscription.Replace({ subscription, context: { organizationID, workspaceID } })
      );

      return subscription;
    } catch {
      return null;
    }
  };

export const cancelSubscription = (organizationID: string): Thunk<void> => {
  return async (dispatch, getState) => {
    const subscription = chargebeeSubscriptionSelector(getState());
    const workspaceID = WorkspaceV2.active.workspaceSelector(getState())?.id;

    if (!subscription || !workspaceID) return;

    await designerClient.billing.subscription.cancel(organizationID, subscription.id);

    await dispatch.local(
      Actions.OrganizationSubscription.Replace({
        subscription: {
          ...subscription,
          status: ChargebeeSubscriptionStatus.NON_RENEWING,
        },
        context: { organizationID, workspaceID },
      })
    );

    dispatch(
      Tracking.trackSubscriptionModified({
        id: subscription.id,
        action: 'downgrade',
        period: subscription.billingPeriodUnit,
        newPlan: PlanName.STARTER,
        previousPlan: subscription.plan,
      })
    );
  };
};

export const downgradeTrial = (organizationID: string, chargebeeSubscriptionID: string): Thunk<void> => {
  return async (dispatch, getState) => {
    const subscription = chargebeeSubscriptionSelector(getState());
    const workspaceID = WorkspaceV2.active.workspaceSelector(getState())?.id;

    if (!subscription || !workspaceID) return;

    await designerClient.billing.subscription.downgradeTrial(organizationID, chargebeeSubscriptionID);

    await dispatch.local(
      Actions.OrganizationSubscription.Replace({
        subscription: {
          ...subscription,
          plan: PlanType.STARTER,
          trial: null,
        },
        context: { organizationID, workspaceID },
      })
    );
  };
};

export const updateSubscriptionPaymentMethod =
  (paymentIntentID: string): Thunk<void> =>
  async (dispatch, getState) => {
    const state = getState();
    const organizationID = WorkspaceV2.active.organizationIDSelector(state);
    const workspaceID = WorkspaceV2.active.workspaceSelector(getState())?.id;

    const customerID = customerIDSelector(state);

    if (!organizationID || !customerID || !workspaceID) {
      throw new Error('Organization subscription not found');
    }

    try {
      const { paymentMethod } = await designerClient.billing.subscription.upsertCustomerCard(organizationID, {
        paymentIntentID,
        customerID,
      });

      dispatch.local(
        Actions.OrganizationSubscription.UpdatePaymentMethod({
          paymentMethod,
          context: { organizationID, workspaceID },
        })
      );
    } catch {
      throw new Error('Card update failed. Please try again.');
    }
  };
