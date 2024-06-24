import { toast } from '@voiceflow/ui';
import { useAtomValue } from 'jotai';

import * as Organization from '@/ducks/organization';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks/redux';
import { useDispatch } from '@/hooks/store.hook';
import { useTrackingEvents } from '@/hooks/tracking';
import { VoidInternalProps } from '@/ModalsV2/types';

import * as atoms from '../../../../../contexts/Plans/Plans.atoms';
import * as CardForm from '../CardForm';
import { PaymentModalProps } from '../Payment.types';
import { useCardPaymentMethod } from './payment-method';
import { usePricing } from './pricing';

export const useCheckoutPayment = ({ modalProps }: { modalProps: VoidInternalProps<PaymentModalProps> }) => {
  const organization = useSelector(Organization.organizationSelector)!;
  const subscription = useSelector(Organization.chargebeeSubscriptionSelector)!;
  const workspace = useSelector(WorkspaceV2.active.workspaceSelector)!;
  const checkout = useDispatch(Organization.subscription.checkout);
  const { selectedPlanPrice } = usePricing();
  const couponIDs = useAtomValue(atoms.couponIDsAtom);

  const isTrialExpired = useSelector(WorkspaceV2.active.organizationTrialExpiredSelector);
  const [trackingEvents] = useTrackingEvents();
  const editorSeats = useAtomValue(atoms.editorSeatsAtom);
  const { cardRef, createAndAuthorizePaymentIntent } = useCardPaymentMethod();

  const onCheckout = async (options: { cardValues?: CardForm.Values; shouldUseExistingCard: boolean }) => {
    if (!organization?.id || !organization.subscription || !selectedPlanPrice) return;
    if (options.shouldUseExistingCard && !subscription.paymentMethod) return;
    if (!options.shouldUseExistingCard && !cardRef.current) return;

    modalProps.api.preventClose();

    try {
      const extraSeats = editorSeats - 1; // 1 is already included in the plan
      const extraSeatsAmount = extraSeats * subscription.additionalSeatsUnitAmount;

      const paymentIntent = await createAndAuthorizePaymentIntent({
        amount: selectedPlanPrice.amount + extraSeatsAmount,
        cardValues: options.cardValues,
        shouldUseExistingCard: options.shouldUseExistingCard,
      });

      await checkout(organization.id, workspace.id, {
        planItemPriceID: selectedPlanPrice.id,
        seats: editorSeats,
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
