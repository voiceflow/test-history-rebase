import { toast } from '@voiceflow/ui';
import { useAtomValue } from 'jotai';

import * as Organization from '@/ducks/organization';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks/redux';
import { useDispatch } from '@/hooks/store.hook';
import { useTrackingEvents } from '@/hooks/tracking';

import * as CardForm from '../components/CardForm';
import * as atoms from '../Payment.atoms';
import { PaymentModalPropsAPI } from '../Payment.types';
import { useCardPaymentMethod } from './payment-method';

export const useCheckoutPayment = ({ modalProps }: { modalProps: PaymentModalPropsAPI }) => {
  const organization = useSelector(Organization.organizationSelector)!;
  const selectedPlanPrice = useAtomValue(atoms.selectedPlanPriceAtom);
  const period = useAtomValue(atoms.periodAtom);
  const checkout = useDispatch(Organization.subscription.checkout);

  const isTrialExpired = useSelector(WorkspaceV2.active.organizationTrialExpiredSelector);
  const [trackingEvents] = useTrackingEvents();
  const editorSeats = useAtomValue(atoms.editorSeatsAtom);
  const { cardRef, onAuthorize } = useCardPaymentMethod();

  const onCheckout = async (cardValues: CardForm.Values) => {
    if (!organization || !organization.chargebeeSubscriptionID || !selectedPlanPrice) return;
    if (!cardRef.current) return;

    modalProps.api.preventClose();

    const paymentIntent = await onAuthorize(selectedPlanPrice.value, cardValues);

    if (!paymentIntent) return;

    try {
      await checkout(organization.id, organization.chargebeeSubscriptionID, {
        editorSeats,
        itemPriceID: selectedPlanPrice.id,
        planPrice: selectedPlanPrice.value,
        period,
        paymentIntent,
      });

      if (isTrialExpired) {
        trackingEvents.trackTrialExpiredUpgrade({ editorSeats });
      }

      modalProps.api.enableClose();
      modalProps.api.close();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      modalProps.api.enableClose();
    }
  };

  return {
    cardRef,
    onSubmit: onCheckout,
  };
};
