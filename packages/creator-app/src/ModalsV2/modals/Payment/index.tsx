import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { PaymentProvider } from '@/contexts/PaymentContext';
import { UpgradePrompt } from '@/ducks/tracking';
import { useFeature } from '@/hooks/feature';

import manager from '../../manager';
import { OldPayment, Payment } from './components';

export interface PaymentModalProps {
  promptType?: UpgradePrompt;
}

const PaymentModal = manager.create<PaymentModalProps>('Payment', () => (props) => {
  const dashboardV2 = useFeature(Realtime.FeatureFlag.DASHBOARD_V2);

  if (!dashboardV2.isEnabled) return <OldPayment {...props} />;

  return (
    <PaymentProvider>
      <Payment {...props} />
    </PaymentProvider>
  );
});

export default PaymentModal;
