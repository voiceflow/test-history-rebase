import { BillingPeriodUnit } from '@voiceflow/dtos';
import { FeatureFlag } from '@voiceflow/realtime-sdk';
import { Box, Button, Modal } from '@voiceflow/ui';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import pluralize from 'pluralize';
import React from 'react';

import * as Organization from '@/ducks/organization';
import { useFeature, useSelector } from '@/hooks';

import * as CardForm from '../CardForm';
import { useCheckoutPayment, usePricing } from '../hooks';
import { PaymentModalPropsAPI } from '../Payment.types';
import { PlanCard } from '../PlanCard/PlanCard.component';

interface PaymentStepProps {
  modalProps: PaymentModalPropsAPI;
  onClose: VoidFunction;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({ onClose, modalProps }) => {
  const { onSubmit: onSubmitForm, cardRef } = useCheckoutPayment({ modalProps });
  const subscription = useSelector(Organization.chargebeeSubscriptionSelector);
  const { selectedPlanPrice, selectedPeriod, selectedPlan } = usePricing();
  const { isEnabled: teamsPlanSelfServeIsEnabled } = useFeature(FeatureFlag.TEAMS_PLAN_SELF_SERVE);
  const [existingCardValue, setExistingCardValue] = React.useState<CardForm.ExistingCardValue>(
    teamsPlanSelfServeIsEnabled && subscription?.paymentMethod
      ? CardForm.ExistingCardValue.EXISTING
      : CardForm.ExistingCardValue.NEW
  );
  const [cardError, setCardError] = React.useState('');

  const onSubmit = async (values: CardForm.Values) => {
    try {
      await cardRef.current?.tokenize();

      return onSubmitForm(values, {
        shouldUseExistingCard: existingCardValue === CardForm.ExistingCardValue.EXISTING,
      });
    } catch (e: any) {
      setCardError(e.message);
      return null;
    }
  };

  const form = useFormik({
    onSubmit,
    initialValues: CardForm.INITIAL_VALUES,
    validationSchema: CardForm.SCHEME,
    enableReinitialize: true,
  });

  const handleSubmitReusingCard = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    form.setSubmitting(true);
    await onSubmitForm(null, { shouldUseExistingCard: true });
    if (modalProps.opened) {
      form.setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={existingCardValue === CardForm.ExistingCardValue.EXISTING ? handleSubmitReusingCard : form.handleSubmit}
    >
      <Modal.Body>
        <Box marginBottom={24}>
          <PlanCard
            title={`${selectedPlan?.name} (${selectedPlan?.seats} Editor ${pluralize('Seat', selectedPlan?.seats)})`}
            amount={selectedPlanPrice?.amount ?? 0}
            period={selectedPeriod === BillingPeriodUnit.MONTH ? 'm' : 'y'}
          >
            Your subscription will automatically renew every month. Next billing date:{' '}
            {dayjs(subscription?.nextBillingAt).format('MMM DD, YYYY')}.
          </PlanCard>
        </Box>
        {teamsPlanSelfServeIsEnabled && subscription?.paymentMethod && (
          <Box marginBottom={16}>
            <CardForm.ExistingCard
              last4={subscription?.paymentMethod?.card?.last4}
              onChange={setExistingCardValue}
              value={existingCardValue}
            />
          </Box>
        )}
        {existingCardValue === CardForm.ExistingCardValue.NEW && (
          <CardForm.Base cardError={cardError} form={form} ref={cardRef} />
        )}
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
