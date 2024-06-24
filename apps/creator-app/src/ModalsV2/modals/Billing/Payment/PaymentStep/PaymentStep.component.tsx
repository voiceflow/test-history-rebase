import type { BillingPlan } from '@voiceflow/dtos';
import { BillingPeriodUnit } from '@voiceflow/dtos';
import { Box, Button, Modal } from '@voiceflow/ui';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import pluralize from 'pluralize';
import React from 'react';

import * as Organization from '@/ducks/organization';
import { useSelector } from '@/hooks';

import { CardForm } from '../CardForm/CardForm.component';
import type { CardFormValues } from '../CardForm/CardForm.scheme';
import { INITIAL_VALUES, SCHEME } from '../CardForm/CardForm.scheme';
import { ExistingCard, ExistingCardValue } from '../CardForm/ExistingCard';
import { useCheckoutPayment } from '../hooks/checkout.hook';
import type { PaymentModalPropsAPI } from '../Payment.types';
import { PlanCard } from '../PlanCard/PlanCard.component';

interface PaymentStepProps {
  modalProps: PaymentModalPropsAPI;
  onClose: VoidFunction;
  couponID?: string;
  amount: number;
  period: BillingPeriodUnit;
  plan: BillingPlan;
  planPriceID: string;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
  modalProps,
  onClose,
  couponID,
  amount,
  plan,
  period,
  planPriceID,
}) => {
  const { checkout, cardRef } = useCheckoutPayment({ modalProps });
  const subscription = useSelector(Organization.chargebeeSubscriptionSelector);
  const [existingCardValue, setExistingCardValue] = React.useState<ExistingCardValue>(
    subscription?.paymentMethod ? ExistingCardValue.EXISTING : ExistingCardValue.NEW
  );
  const [cardError, setCardError] = React.useState('');

  const submit = (options?: { cardValues?: CardFormValues }) =>
    checkout({ ...options, amount, planPriceID, couponID, seats: 1 });

  const onSubmit = async (cardValues: CardFormValues) => {
    try {
      await cardRef.current?.tokenize();
      return submit({ cardValues });
    } catch (e: any) {
      setCardError(e.message);
      return null;
    }
  };

  const form = useFormik({
    onSubmit,
    initialValues: INITIAL_VALUES,
    validationSchema: SCHEME,
    enableReinitialize: true,
  });

  const handleSubmitReusingCard = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    form.setSubmitting(true);
    await submit();

    if (modalProps.opened) {
      form.setSubmitting(false);
    }
  };

  return (
    <form onSubmit={existingCardValue === ExistingCardValue.EXISTING ? handleSubmitReusingCard : form.handleSubmit}>
      <Modal.Body>
        <Box marginBottom={24}>
          <PlanCard
            title={`${plan.name} (${plan.seats} Editor ${pluralize('Seat', plan.seats)})`}
            amount={amount}
            period={period === BillingPeriodUnit.MONTH ? 'm' : 'y'}
          >
            Your subscription will automatically renew every month. Next billing date:{' '}
            {dayjs(subscription?.nextBillingAt).format('MMM DD, YYYY')}.
          </PlanCard>
        </Box>
        {subscription?.paymentMethod && (
          <Box marginBottom={16}>
            <ExistingCard
              last4={subscription?.paymentMethod?.card?.last4}
              onChange={setExistingCardValue}
              value={existingCardValue}
            />
          </Box>
        )}
        {existingCardValue === ExistingCardValue.NEW && <CardForm cardError={cardError} form={form} ref={cardRef} />}
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
