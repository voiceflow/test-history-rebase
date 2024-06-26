import { BillingPeriod } from '@voiceflow/internal';
import { Box, Button, Modal } from '@voiceflow/ui';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import pluralize from 'pluralize';
import React from 'react';

import * as CardForm from '../../Billing/components/CardForm';
import PlanCard from './PlanCard';

interface PaymentStepProps {
  price: number;
  period: BillingPeriod;
  editorSeats: number;
  onClose: VoidFunction;
  onSubmit: (values: CardForm.Values) => Promise<void>;
}

const PaymentStep: React.FC<PaymentStepProps> = ({ price, onSubmit, period, onClose, editorSeats }) => {
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

        <CardForm.Base form={form} />
      </Modal.Body>

      <Modal.Footer gap={12}>
        <Button type="button" onClick={() => onClose()} variant={Button.Variant.TERTIARY} squareRadius>
          Cancel
        </Button>

        <Button
          width={144}
          type="submit"
          variant={Button.Variant.PRIMARY}
          disabled={form.isSubmitting}
          squareRadius
          isLoading={form.isSubmitting}
        >
          Confirm & Pay
        </Button>
      </Modal.Footer>
    </form>
  );
};

export default PaymentStep;
