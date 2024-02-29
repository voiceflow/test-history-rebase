import { Modal, Switch, System, useAsyncMountUnmount } from '@voiceflow/ui';
import React from 'react';

import manager from '../../../manager';
import { BillingStep, PaymentStep, PlanStep } from './components';
import { Step } from './Payment.constants';
import { usePaymentSteps, usePlans } from './Payment.hooks';
import { PaymentModalProps } from './Payment.types';

export const Payment = manager.create<PaymentModalProps>('Payment', () => (modalProps) => {
  const { type, opened, hidden, animated, api, closePrevented, promptType } = modalProps;
  const { activeStep, onBack, onReset } = usePaymentSteps();
  const { fetchPlans, loadChargebee } = usePlans();

  const handleExited = () => {
    onReset();
    api.remove();
  };

  useAsyncMountUnmount(async () => {
    loadChargebee();
    await fetchPlans();
  });

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={handleExited} maxWidth={500}>
      <Modal.Header actions={<Modal.Header.CloseButtonAction disabled={closePrevented} onClick={api.onClose} />} capitalizeText={false}>
        {activeStep !== Step.PLAN && (
          <System.IconButtonsGroup.Base mr={12}>
            <System.IconButton.Base icon="largeArrowLeft" disabled={closePrevented} onClick={onBack} />
          </System.IconButtonsGroup.Base>
        )}

        <Modal.Header.Title large>Choose a Plan</Modal.Header.Title>
      </Modal.Header>

      <Switch active={activeStep}>
        <Switch.Pane value={Step.PLAN}>
          <PlanStep promptType={promptType} onClose={api.onClose} />
        </Switch.Pane>

        <Switch.Pane value={Step.BILLING}>
          <BillingStep isLoading={closePrevented} />
        </Switch.Pane>

        <Switch.Pane value={Step.PAYMENT}>
          <PaymentStep onClose={api.onClose} modalProps={modalProps} />
        </Switch.Pane>
      </Switch>
    </Modal>
  );
});
