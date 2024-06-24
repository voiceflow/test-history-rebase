import { toast } from '@voiceflow/ui';
import { useAtomValue } from 'jotai';

import * as atoms from '@/contexts/PaymentContext/Plans/Plans.atoms';
import * as Organization from '@/ducks/organization';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks/redux';
import { useDispatch } from '@/hooks/store.hook';
import { useTrackingEvents } from '@/hooks/tracking';

import * as CardForm from '../CardForm';
import { PaymentModalPropsAPI } from '../Payment.types';
import { useCardPaymentMethod } from './payment-method';
import { usePricing } from './pricing';

export const useCheckoutPayment = ({ modalProps }: { modalProps: PaymentModalPropsAPI }) => {
  const organization = useSelector(Organization.organizationSelector)!;
  const workspace = useSelector(WorkspaceV2.active.workspaceSelector)!;
  const checkout = useDispatch(Organization.subscription.checkout);
  const { selectedPlanPrice } = usePricing();

  const couponID = useAtomValue(atoms.couponIDAtom);

  const isTrialExpired = useSelector(WorkspaceV2.active.organizationTrialExpiredSelector);
  const [trackingEvents] = useTrackingEvents();
  const editorSeats = useAtomValue(atoms.editorSeatsAtom);
  const { cardRef, createAndAuthorizePaymentIntent } = useCardPaymentMethod();

  const onCheckout = async (cardValues: CardForm.Values | null, options: { shouldUseExistingCard: boolean }) => {
    if (!organization?.id || !organization.subscription || !selectedPlanPrice) return;

    modalProps.api.preventClose();

    try {
      const paymentIntent = await createAndAuthorizePaymentIntent({
        amount: selectedPlanPrice.amount,
        cardValues,
        shouldUseExistingCard: options.shouldUseExistingCard,
      });

      await checkout(organization.id, workspace.id, {
        planItemPriceID: selectedPlanPrice.id,
        paymentIntent,
        couponIDs: couponID ? [couponID] : undefined,
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
