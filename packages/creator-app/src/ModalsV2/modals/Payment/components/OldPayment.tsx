import { Modal, useSetup } from '@voiceflow/ui';
import React from 'react';

import { receiptGraphic } from '@/assets';
import { useTrackingEvents } from '@/hooks/tracking';
import { useSuccessModal } from '@/ModalsV2/hooks';
import { VoidInternalProps } from '@/ModalsV2/types';
import PaymentPage from '@/pages/Payment';

const Payment = ({ api, type, opened, hidden, animated }: VoidInternalProps) => {
  const successModal = useSuccessModal();
  const [trackingEvents] = useTrackingEvents();

  const onCheckout = (message: string) => {
    api.resolve();
    api.close();

    successModal.openVoid({ icon: receiptGraphic, header: 'Payment Successful', message });
  };

  useSetup(() => trackingEvents.trackUpgradeModal());

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={545} minHeight={100}>
      <PaymentPage onCheckout={onCheckout} />
    </Modal>
  );
};

export default Payment;
