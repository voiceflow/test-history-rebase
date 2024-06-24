import { toast } from '@voiceflow/ui';
import { useAtomValue } from 'jotai';

import * as planAtoms from '@/contexts/PaymentContext/Plans/Plans.atoms';
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

  const couponID = useAtomValue(planAtoms.couponIDAtom);

  const updateSeats = useDispatch(Organization.subscription.updateSeats);
  const { createAndAuthorizePaymentIntent } = useCardPaymentMethod();

  const onChangeSeats = async (newSeats: number) => {
    if (!organization?.id || !subscription?.paymentMethod || !subscription.planItemPriceID) return;

    modalProps.api.preventClose();

    try {
      const extraSeats = newSeats - 1; // 1 is already included in the plan
      const extraSeatsAmount = extraSeats * subscription.additionalSeatsUnitAmount;

      const paymentIntent = await createAndAuthorizePaymentIntent({
        amount: subscription.planAmount + extraSeatsAmount,
        shouldUseExistingCard: true,
      });

      await updateSeats(organization.id, workspace.id, {
        paymentIntent,
        planItemPriceID: subscription.planItemPriceID,
        seats: newSeats,
        couponIDs: couponID ? [couponID] : undefined,
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
