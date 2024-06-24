import { toast } from '@voiceflow/ui';

import * as Organization from '@/ducks/organization';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks/redux';
import { useDispatch } from '@/hooks/store.hook';
import { useTrackingEvents } from '@/hooks/tracking';

import type { CardFormValues } from '../CardForm/CardForm.scheme';
import type { PaymentModalPropsAPI } from '../Payment.types';
import { useCardPaymentMethod } from './payment-method.hook';

export const useCheckoutPayment = ({ modalProps }: { modalProps: PaymentModalPropsAPI }) => {
  const organization = useSelector(Organization.organizationSelector)!;
  const workspace = useSelector(WorkspaceV2.active.workspaceSelector)!;
  const checkout = useDispatch(Organization.subscription.checkout);

  const isTrialExpired = useSelector(WorkspaceV2.active.organizationTrialExpiredSelector);
  const [trackingEvents] = useTrackingEvents();
  const { cardRef, authorizeNewCard, authorizeExistingCard, createPaymentIntent } = useCardPaymentMethod();

  const onCheckout = async ({
    cardValues,
    amount,
    planPriceID,
    couponID,
    seats,
  }: {
    cardValues?: CardFormValues;
    couponID?: string;
    amount: number;
    planPriceID: string;
    seats: number;
  }) => {
    if (!organization?.id || !organization.subscription) return;

    modalProps.api.preventClose();

    try {
      let paymentIntent = await createPaymentIntent({
        amount,
        shouldUseExistingCard: !cardValues,
      });

      if (cardValues) {
        paymentIntent = await authorizeNewCard({ paymentIntent, cardValues });
      } else {
        paymentIntent = await authorizeExistingCard(paymentIntent);
      }

      await checkout(organization.id, workspace.id, {
        planItemPriceID: planPriceID,
        paymentIntent,
        seats,
        couponIDs: couponID ? [couponID] : undefined,
      });

      if (isTrialExpired) {
        trackingEvents.trackTrialExpiredUpgrade({ editorSeats: seats });
      }

      modalProps.api.enableClose();
      modalProps.api.close();
    } catch (error) {
      modalProps.api.enableClose();
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return {
    cardRef,
    checkout: onCheckout,
  };
};
