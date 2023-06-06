import React from 'react';

import { PaymentProvider } from '@/contexts/PaymentContext';
import { UpgradePrompt } from '@/ducks/tracking';

import manager from '../../manager';
import { Payment } from './components';

export interface PaymentModalProps {
  promptType?: UpgradePrompt;
  isTrialExpired?: boolean;
}

const PaymentModal = manager.create<PaymentModalProps>('Payment', () => (props) => (
  <PaymentProvider>
    <Payment {...props} />
  </PaymentProvider>
));

export default PaymentModal;
