import { Subscription } from '@voiceflow/dtos';
import { Actions } from '@voiceflow/sdk-logux-designer';
import { toast } from '@voiceflow/ui';

import client from '@/client';
import { designerClient } from '@/client/designer';
import * as Errors from '@/config/errors';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { Thunk } from '@/store/types';
import { getErrorMessage } from '@/utils/error';

import { chargebeeScheduledSubscriptionSelector, chargebeeSubscriptionSelector } from '../selectors/active';

export const updateActiveOrganizationName =
  (name: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const organizationID = WorkspaceV2.active.organizationIDSelector(state);

    Errors.assertOrganizationID(organizationID);

    try {
      await dispatch.sync(Actions.Organization.PatchOne({ id: organizationID, patch: { name } }));
    } catch (err) {
      toast.error(getErrorMessage(err, 'Invalid organization name'));
    }
  };

export const updateActiveOrganizationImage =
  (formData: FormData): Thunk<string> =>
  async (dispatch, getState) => {
    const state = getState();
    const organizationID = WorkspaceV2.active.organizationIDSelector(state);

    Errors.assertOrganizationID(organizationID);

    try {
      // TODO: [organization refactor] move this to organization http endpoint
      const { image } = await client.identity.organization.updateImage(organizationID, formData);
      await dispatch.sync(Actions.Organization.PatchOne({ id: organizationID, patch: { image } }));

      return image;
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't update image"));

      throw err;
    }
  };

export const removeActiveOrganizationAdmin =
  (creatorID: number): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const organizationID = WorkspaceV2.active.organizationIDSelector(state);

    Errors.assertOrganizationID(organizationID);

    try {
      await dispatch.sync(Actions.OrganizationMember.DeleteOne({ organizationID, id: creatorID }));
    } catch (err) {
      toast.genericError();
    }
  };

export const loadActiveOrganizationSubscription =
  (organizationID: string, chargebeeSubscriptionID: string): Thunk<Subscription | null> =>
  async (dispatch) => {
    try {
      const subscription = (await designerClient.billing.subscription.findOne(organizationID, chargebeeSubscriptionID)) as Subscription;

      await dispatch.local(Actions.OrganizationSubscription.Replace({ organizationID, subscription }));

      return subscription;
    } catch {
      return null;
    }
  };

export const loadActiveOrganizationSchduledSubscription =
  (organizationID: string, chargebeeSubscriptionID: string): Thunk<Subscription | null> =>
  async (dispatch) => {
    try {
      const subscription = await designerClient.billing.subscription.getSubscriptionScheduledChanges(organizationID, chargebeeSubscriptionID);

      dispatch(Realtime.organization.replaceScheduledSubscription({ organizationID, subscription }));

      return subscription;
    } catch {
      return null;
    }
  };

export const updateSeats = (organizationID: string, chargebeeSubscriptionID: string, seats: number): Thunk<void> => {
  return async (dispatch, getState) => {
    try {
      const subscription = chargebeeSubscriptionSelector(getState());
      await designerClient.billing.subscription.updateSeats(organizationID, chargebeeSubscriptionID, { seats });

      if (!subscription) return;

      dispatch(
        Realtime.organization.replaceSubscription({
          organizationID,
          subscription: {
            ...subscription,
            editorSeats: seats,
          },
        })
      );
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to update seats'));
    }
  };
};

export const scheduleSeatsUpdate = (organizationID: string, chargebeeSubscriptionID: string, seats: number): Thunk<void> => {
  return async (dispatch, getState) => {
    try {
      await designerClient.billing.subscription.scheduleSeatsUpdate(organizationID, chargebeeSubscriptionID, { seats });

      const scheduledSubscription = chargebeeScheduledSubscriptionSelector(getState());
      const subscription = chargebeeSubscriptionSelector(getState());

      const sub = scheduledSubscription || subscription;

      if (!sub) return;

      dispatch(
        Realtime.organization.replaceScheduledSubscription({
          organizationID,
          subscription: {
            ...sub,
            editorSeats: seats,
          },
        })
      );
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to schedule seats update'));
    }
  };
};

export const cancelSubscription = (organizationID: string, chargebeeSubscriptionID: string): Thunk<void> => {
  return async () => {
    try {
      await designerClient.billing.subscription.cancel(organizationID, chargebeeSubscriptionID);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to cancel subscription'));
    }
  };
};
