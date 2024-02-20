import React from 'react';

import * as Payment from '@/contexts/PaymentContext';
import { UpgradePrompt } from '@/ducks/tracking';

import manager from '../../manager';
import { LegacyPayment } from './components';

export interface PaymentModalProps {
  promptType?: UpgradePrompt;
  isTrialExpired?: boolean;
}

const PaymentModal = manager.create<PaymentModalProps>('Payment', () => (props) => {
  // TODO (chargebee billing): add logic to render new payment modal based on organization chargebee subscription

  return (
    <Payment.legacy.PaymentProvider>
      <LegacyPayment {...props} />
    </Payment.legacy.PaymentProvider>
  );
});

export default PaymentModal;
