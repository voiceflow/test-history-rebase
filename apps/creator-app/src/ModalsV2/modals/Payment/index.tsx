import React from 'react';

import * as PaymentContext from '@/contexts/PaymentContext';
import * as Organization from '@/ducks/organization';
import { UpgradePrompt } from '@/ducks/tracking';
import { useSelector } from '@/hooks';

import manager from '../../manager';
import { LegacyPayment, Payment } from './components';

export interface PaymentModalProps {
  promptType?: UpgradePrompt;
  isTrialExpired?: boolean;
}

const PaymentModal = manager.create<PaymentModalProps>('Payment', () => (props) => {
  const chargebeeSubscriptionID = useSelector(Organization.chargebeeSubscriptionIDSelector);

  if (chargebeeSubscriptionID) {
    return <Payment {...props} />;
  }

  return (
    <PaymentContext.legacy.PaymentProvider>
      <LegacyPayment {...props} />
    </PaymentContext.legacy.PaymentProvider>
  );
});

export default PaymentModal;
