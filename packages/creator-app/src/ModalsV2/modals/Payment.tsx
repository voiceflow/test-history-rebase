import { Modal } from '@voiceflow/ui';
import React from 'react';

import { receiptGraphic } from '@/assets';
import { useSetup, useTrackingEvents } from '@/hooks';
import PaymentPage from '@/pages/Payment';

import { useModal } from '../hooks';
import manager from '../manager';
import Success from './Success';

export interface Props {
  focus?: string;
}

const Payment = manager.create<Props>('Payment', () => ({ api, focus, type, opened, hidden, animated }) => {
  const successModal = useModal(Success);

  const [trackingEvents] = useTrackingEvents();

  const onCheckout = (message: string) => {
    api.resolve();
    api.close();

    successModal.openVoid({ icon: receiptGraphic, header: 'Payment Successful', message });
  };

  useSetup(() => trackingEvents.trackUpgradeModal());

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={545} minHeight={100}>
      <PaymentPage focus={focus} onCheckout={onCheckout} />
    </Modal>
  );
});

export default Payment;
