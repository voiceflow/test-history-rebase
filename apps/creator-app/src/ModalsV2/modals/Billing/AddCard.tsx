import { Button, Modal, SectionV2 } from '@voiceflow/ui';
import { useFormik } from 'formik';
import React from 'react';

import { usePlans } from '@/contexts/Plans/Plans.context';
import * as Organization from '@/ducks/organization';
import { useSelector } from '@/hooks/redux';
import manager from '@/ModalsV2/manager';

import * as CardForm from './Payment/CardForm';
import { useCardPaymentMethod } from './Payment/hooks';

interface AddCardProps {
  isUpdate?: boolean;
}

export const AddCard = manager.create<AddCardProps>(
  'BillingAddCard',
  () =>
    ({ isUpdate, api, type, opened, hidden, animated }) => {
      const activePlan = useSelector(Organization.subscriptionPlanSelector);
      const billingPeriodUnit = useSelector(Organization.subscriptionBillingPeriodUnitSelector);
      const [cardError, setCardError] = React.useState('');

      const { cardRef, updatePaymentMethod } = useCardPaymentMethod();
      const { getPlanPrice } = usePlans();

      const form = useFormik({
        onSubmit: async (values) => {
          try {
            await cardRef.current?.tokenize();
            const planPrice = getPlanPrice(activePlan, billingPeriodUnit);

            if (!planPrice) return;

            api.preventClose();

            await updatePaymentMethod(planPrice.amount, values);

            api.enableClose();
            api.close();
          } catch (error) {
            api.enableClose();
            if (error instanceof Error) {
              setCardError(error.message);
            }
          }
        },
        initialValues: CardForm.INITIAL_VALUES,
        validationSchema: CardForm.SCHEME,
        enableReinitialize: true,
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

            <Button
              type="submit"
              variant={Button.Variant.PRIMARY}
              disabled={form.isSubmitting}
              isLoading={form.isSubmitting}
              onClick={form.submitForm}
              width={131}
            >
              {isUpdate ? 'Update Card' : 'Add Card'}
            </Button>
          </Modal.Footer>
        </Modal>
      );
    }
);
