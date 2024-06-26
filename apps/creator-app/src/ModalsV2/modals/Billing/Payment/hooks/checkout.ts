import { toast } from '@voiceflow/ui';
import { useAtomValue } from 'jotai';

import * as Organization from '@/ducks/organization';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks/redux';
import { useDispatch } from '@/hooks/store.hook';
import { useTrackingEvents } from '@/hooks/tracking';

import type * as CardForm from '../CardForm';
import * as atoms from '../Payment.atoms';
import type { PaymentModalPropsAPI } from '../Payment.types';
import { useCardPaymentMethod } from './payment-method';
import { usePricing } from './pricing';

export const useCheckoutPayment = ({ modalProps }: { modalProps: PaymentModalPropsAPI }) => {
  const organization = useSelector(Organization.organizationSelector)!;
  const subscription = useSelector(Organization.chargebeeSubscriptionSelector)!;
  const workspace = useSelector(WorkspaceV2.active.workspaceSelector)!;
  const checkout = useDispatch(Organization.subscription.checkout);
  const { selectedPlanPrice } = usePricing();
  const couponIDs = useAtomValue(atoms.couponIDsAtom);

  const isTrialExpired = useSelector(WorkspaceV2.active.organizationTrialExpiredSelector);
  const [trackingEvents] = useTrackingEvents();
  const editorSeats = useAtomValue(atoms.editorSeatsAtom);
  const { cardRef, authorizeNewCard, authorizeExistingCard, createPaymentIntent } = useCardPaymentMethod();

  const onCheckout = async (cardValues: CardForm.Values | null, options: { shouldUseExistingCard: boolean }) => {
    if (!organization?.id || !organization.subscription || !selectedPlanPrice) return;
    if (options.shouldUseExistingCard && !subscription.paymentMethod) return;
    if (!options.shouldUseExistingCard && !cardRef.current) return;

    modalProps.api.preventClose();

    try {
      let paymentIntent = await createPaymentIntent({
        amount: selectedPlanPrice.amount,
        address: cardValues?.address,
        shouldUseExistingCard: options.shouldUseExistingCard,
      });

      if (!options.shouldUseExistingCard && cardValues) {
        paymentIntent = await authorizeNewCard({ paymentIntent, cardValues });
      } else {
        paymentIntent = await authorizeExistingCard(paymentIntent);
      }

      await checkout(organization.id, workspace.id, {
        planItemPriceID: selectedPlanPrice.id,
        paymentIntent,
        couponIDs,
      });

      if (isTrialExpired) {
        trackingEvents.trackTrialExpiredUpgrade({ editorSeats });
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
    onSubmit: onCheckout,
  };
};
