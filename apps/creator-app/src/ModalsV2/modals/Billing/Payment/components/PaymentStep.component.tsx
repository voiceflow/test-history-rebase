import { BillingPeriod } from '@voiceflow/internal';
import { Box, Button, Modal } from '@voiceflow/ui';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import pluralize from 'pluralize';
import React from 'react';

import { useCheckoutPayment, usePricing, useSeats } from '../Payment.hooks';
import { PaymentModalAPIProps } from '../Payment.types';
import * as CardForm from './CardForm';
import { PlanCard } from './PlanCard.component';

interface PaymentStepProps {
  modalProps: PaymentModalAPIProps;
  onClose: VoidFunction;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({ onClose, modalProps }) => {
  const { cardRef, onSubmit } = useCheckoutPayment({ modalProps });
  const { editorSeats } = useSeats();
  const { price, period } = usePricing();

  const form = useFormik({
    onSubmit,
    initialValues: CardForm.INITIAL_VALUES,
    validationSchema: CardForm.SCHEME,
    enableReinitialize: true,
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <Modal.Body>
        <Box marginBottom={24}>
          <PlanCard
            title={`Pro (${editorSeats} Editor ${pluralize('Seat', editorSeats)})`}
            price={price}
            period={period === BillingPeriod.MONTHLY ? 'm' : 'y'}
          >
            Your subscription will automatically renew every month. Next billing date: {dayjs().format('MMM DD, YYYY')}.
          </PlanCard>
        </Box>

        <CardForm.Base form={form} ref={cardRef} />
      </Modal.Body>

      <Modal.Footer gap={12}>
        <Button type="button" onClick={() => onClose()} variant={Button.Variant.TERTIARY} squareRadius>
          Cancel
        </Button>

        <Button width={144} type="submit" variant={Button.Variant.PRIMARY} disabled={form.isSubmitting} squareRadius isLoading={form.isSubmitting}>
          Confirm & Pay
        </Button>
      </Modal.Footer>
    </form>
  );
};
