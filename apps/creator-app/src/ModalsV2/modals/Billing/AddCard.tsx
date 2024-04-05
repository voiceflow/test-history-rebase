import { BillingPeriod } from '@voiceflow/internal';
import { Button, Modal, SectionV2, toast, useAsyncMountUnmount } from '@voiceflow/ui';
import { useFormik } from 'formik';
import React, { useMemo } from 'react';

import * as Organization from '@/ducks/organization';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch } from '@/hooks';
import { useSelector } from '@/hooks/redux';
import manager from '@/ModalsV2/manager';

import * as CardForm from './Payment/components/CardForm';
import { useCardPaymentMethod, usePlans } from './Payment/hooks';

interface AddCardProps {
  isUpdate?: boolean;
}

export const AddCard = manager.create<AddCardProps>('BillingAddCard', () => ({ isUpdate, api, type, opened, hidden, animated }) => {
  const activePlan = useSelector(WorkspaceV2.active.planSelector);
  const planPeriod = useSelector(WorkspaceV2.active.planPeriodSelector);
  const updateSubscriptionPaymentMethod = useDispatch(Organization.subscription.updateSubscriptionPaymentMethod);
  const [cardError, setCardError] = React.useState('');

  const { cardRef, onAuthorize } = useCardPaymentMethod();
  const { plans, fetchPlans } = usePlans();
  const planPrice = useMemo(
    () => (planPeriod ? plans.find((plan) => plan.id === activePlan)?.prices.find((price) => price.period === (planPeriod as BillingPeriod)) : null),
    [activePlan, plans, planPeriod]
  );

  const onSubmitForm = async (values: CardForm.Values) => {
    if (!planPrice) return;

    api.preventClose();

    const paymentIntent = await onAuthorize(planPrice.amount, values);

    if (!paymentIntent) {
      toast.error('Card authorization failed. Please try again.');
      api.enableClose();
      return;
    }

    try {
      await updateSubscriptionPaymentMethod(paymentIntent.id);
      toast.success('Card updated successfully');
      api.enableClose();
      api.close();
    } catch (e) {
      api.enableClose();
      toast.error('Card update failed. Please try again.');
    }
  };

  const form = useFormik({
    onSubmit: async (values) => {
      try {
        await cardRef.current?.tokenize();

        return onSubmitForm(values);
      } catch (e: any) {
        setCardError(e.message);
        return null;
      }
    },
    initialValues: CardForm.INITIAL_VALUES,
    validationSchema: CardForm.SCHEME,
    enableReinitialize: true,
  });

  useAsyncMountUnmount(async () => {
    await fetchPlans();
  });

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={500}>
      <Modal.Header actions={<Modal.Header.CloseButton onClick={api.onClose} />} border>
        <Modal.Header.Title large>{isUpdate ? 'Update Card' : 'Add Card'}</Modal.Header.Title>
      </Modal.Header>

      <SectionV2.SimpleSection headerProps={{ topUnit: 3 }}>
        <CardForm.Base ref={cardRef} form={form} disabled={form.isSubmitting} cardError={cardError} />
      </SectionV2.SimpleSection>

      <Modal.Footer gap={8}>
        <Button onClick={api.onClose} variant={Button.Variant.TERTIARY} squareRadius>
          Cancel
        </Button>

        <Button type="submit" variant={Button.Variant.PRIMARY} disabled={form.isSubmitting} isLoading={form.isSubmitting} onClick={form.submitForm}>
          {isUpdate ? 'Update Card' : 'Add Card'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
});
