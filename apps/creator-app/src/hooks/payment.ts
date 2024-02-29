import * as Organization from '@/ducks/organization';
import * as ModalsV2 from '@/ModalsV2';

import { useSelector } from './redux';

export const useCheckoutPaymentModal = () => {
  const legacyPaymentModal = ModalsV2.useModal(ModalsV2.Legacy.Payment);
  const newPaymentModal = ModalsV2.useModal(ModalsV2.Billing.Payment);
  const chargebeeSubscriptionID = useSelector(Organization.chargebeeSubscriptionIDSelector);
  return chargebeeSubscriptionID ? newPaymentModal : legacyPaymentModal;
};
