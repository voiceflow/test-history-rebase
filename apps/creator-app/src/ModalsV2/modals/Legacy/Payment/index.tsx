import React from 'react';

import * as PaymentContext from '@/contexts/PaymentContext';
import type { UpgradePrompt } from '@/ducks/tracking';

import manager from '../../../manager';
import { Payment } from './components';

export interface PaymentModalProps {
  promptType?: UpgradePrompt;
  isTrialExpired?: boolean;
}

const PaymentModal = manager.create<PaymentModalProps>('LegacyPayment', () => (props) => (
  <PaymentContext.legacy.PaymentProvider>
    <Payment {...props} />
  </PaymentContext.legacy.PaymentProvider>
));

export default PaymentModal;
