import { Utils } from '@voiceflow/common';
import { BillingCheckoutPlan, CreditCard } from '@voiceflow/dtos';
import { Actions } from '@voiceflow/sdk-logux-designer';
import { toast } from '@voiceflow/ui';

import { waitAsync } from '@/ducks/utils';
import { Thunk } from '@/store/types';
import { getErrorMessage } from '@/utils/error';

export const checkout = (organizationID: string, subscriptionID: string, card: CreditCard, selectedPlan: BillingCheckoutPlan): Thunk<void> => {
  const { itemPriceID, planPrice, editorSeats, period } = selectedPlan;

  return async (dispatch) => {
    try {
      const newSubscription = await dispatch(
        waitAsync(Actions.OrganizationSubscription.Checkout, {
          editorSeats,
          itemPriceID,
          period,
          planPrice,
          card,
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
