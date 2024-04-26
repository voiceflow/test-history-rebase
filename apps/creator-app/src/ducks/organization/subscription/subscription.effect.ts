import { Utils } from '@voiceflow/common';
import type { Subscription } from '@voiceflow/dtos';
import { PlanType } from '@voiceflow/internal';
import { Actions } from '@voiceflow/sdk-logux-designer';
import { toast } from '@voiceflow/ui';

import { designerClient } from '@/client/designer';
import { waitAsync } from '@/ducks/utils';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { ChargebeeSubscriptionStatus } from '@/models';
import type { Thunk } from '@/store/types';
import { getErrorMessage } from '@/utils/error';

import { chargebeeSubscriptionSelector, customerIDSelector } from './subscription.select';

export const checkout = (
  organizationID: string,
  workspaceID: string,
  data: Omit<Actions.OrganizationSubscription.CheckoutRequest, 'context'>
): Thunk<void> => {
  const { itemPriceID, paymentIntent } = data;

  return async (dispatch) => {
    try {
      const newSubscription = await dispatch(
        waitAsync(Actions.OrganizationSubscription.Checkout, {
          itemPriceID,
          paymentIntent,
          couponIds: data.couponIds,
          context: { organizationID, workspaceID },
        })
      );

      toast.success(`Upgraded to ${Utils.string.capitalizeFirstLetter(newSubscription.plan)}!`);
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

    const { paymentMethod } = await designerClient.billing.subscription.upsertCustomerCard(organizationID, {
      json: {
        paymentIntentID,
        customerID,
      },
    });

    dispatch.local(
      Actions.OrganizationSubscription.UpdatePaymentMethod({
        paymentMethod,
        context: { organizationID, workspaceID },
      })
    );
  };
