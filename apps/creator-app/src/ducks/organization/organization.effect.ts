import { Subscription } from '@voiceflow/dtos';
import { PlanType } from '@voiceflow/internal';
import { Actions } from '@voiceflow/sdk-logux-designer';
import { toast } from '@voiceflow/ui';

import client from '@/client';
import { designerClient } from '@/client/designer';
import * as Errors from '@/config/errors';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { Thunk } from '@/store/types';
import { getErrorMessage } from '@/utils/error';

import { chargebeeSubscriptionSelector } from './subscription/subscription.select';

export const updateActiveOrganizationName =
  (name: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const organizationID = WorkspaceV2.active.organizationIDSelector(state);

    Errors.assertOrganizationID(organizationID);

    try {
      await dispatch.sync(Actions.Organization.PatchOne({ id: organizationID, patch: { name }, context: { organizationID } }));
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
      await dispatch.sync(Actions.Organization.PatchOne({ id: organizationID, patch: { image }, context: { organizationID } }));

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
      await dispatch.sync(Actions.OrganizationMember.DeleteOne({ id: creatorID, context: { organizationID } }));
    } catch (err) {
      toast.genericError();
    }
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
  return async () => {
    try {
      await designerClient.billing.subscription.cancel(organizationID, chargebeeSubscriptionID);
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
