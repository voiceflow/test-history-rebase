import { toast } from '@voiceflow/ui';
import { useAtomValue } from 'jotai';

import * as planAtoms from '@/contexts/Plans/Plans.atoms';
import * as Organization from '@/ducks/organization';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks/redux';
import { useDispatch } from '@/hooks/store.hook';
import { VoidInternalProps } from '@/ModalsV2/types';

import { useCardPaymentMethod } from '../Payment/hooks';

export const useAddSeatsCheckoutPayment = ({ modalProps }: { modalProps: Pick<VoidInternalProps, 'api'> }) => {
  const organization = useSelector(Organization.organizationSelector)!;
  const subscription = useSelector(Organization.chargebeeSubscriptionSelector)!;
  const workspace = useSelector(WorkspaceV2.active.workspaceSelector)!;

  const couponIDs = useAtomValue(planAtoms.couponIDsAtom);
  const editorSeats = useAtomValue(planAtoms.editorSeatsAtom);

  const checkout = useDispatch(Organization.subscription.checkout);
  const { createAndAuthorizePaymentIntent } = useCardPaymentMethod();

  const onChangeSeats = async (newSeats: number) => {
    if (!organization?.id || !subscription?.paymentMethod || !subscription.planItemPriceID) return;

    modalProps.api.preventClose();

    try {
      const extraSeats = newSeats - 1; // 1 is already included in the plan
      const extraSeatsAmount = extraSeats * subscription.additionalSeatsUnitAmount;

      // if we are reducing seats, we don't need to create a payment intent
      const paymentIntent =
        newSeats > editorSeats
          ? await createAndAuthorizePaymentIntent({
              amount: subscription.planAmount + extraSeatsAmount,
              shouldUseExistingCard: true,
            })
          : null;

      await checkout(organization.id, workspace.id, {
        ...(paymentIntent && { paymentIntent }),
        planItemPriceID: subscription.planItemPriceID,
        seats: newSeats,
        couponIDs,
      });

      modalProps.api.enableClose();
      modalProps.api.close();
    } catch (error) {
      modalProps.api.enableClose();

      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return onChangeSeats;
};
