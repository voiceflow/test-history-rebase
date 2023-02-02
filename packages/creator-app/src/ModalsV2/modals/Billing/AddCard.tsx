import { Button, Modal, SectionV2, withProvider } from '@voiceflow/ui';
import { useFormik } from 'formik';
import React from 'react';

import { CardHolderInfo, PaymentProvider, usePaymentAPI } from '@/contexts/PaymentContext';
import BillingCardForm, { INITIAL_VALUES, SCHEME } from '@/pages/DashboardV2/components/CardForm';

import manager from '../../manager';
import { VoidInternalProps } from '../../types';

const BillingAddCard = manager.create('BillingAddCard', () =>
  withProvider(PaymentProvider)(({ api, type, opened, hidden, animated }: VoidInternalProps) => {
    const paymentAPI = usePaymentAPI();

    const onSubmitForm = async (values: CardHolderInfo) => {
      api.preventClose();
      await paymentAPI.createFullSource(values);
      api.enableClose();
      api.close();
    };

    const form = useFormik({
      onSubmit: onSubmitForm,
      initialValues: INITIAL_VALUES,
      validationSchema: SCHEME,
      enableReinitialize: true,
    });

    const handleChange = (eventOrField: React.ChangeEvent<HTMLInputElement> | string, value?: unknown) => {
      if (typeof eventOrField === 'string') {
        form.setFieldValue(eventOrField, value);
      } else {
        form.handleChange(eventOrField);
      }
    };

    return (
      <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={500}>
        <form onSubmit={form.handleSubmit}>
          <Modal.Header actions={<Modal.Header.CloseButton onClick={api.close} />} border>
            <Modal.Header.Title large>Add Card</Modal.Header.Title>
          </Modal.Header>

          <SectionV2.SimpleSection headerProps={{ topUnit: 3 }}>
            <BillingCardForm
              disabled={form.isSubmitting}
              setFieldTouched={form.setFieldTouched}
              onError={form.setFieldError}
              errors={form.errors}
              touched={form.touched}
              values={form.values}
              onChange={handleChange}
            />
          </SectionV2.SimpleSection>

          <Modal.Footer gap={8}>
            <Button onClick={() => api.close()} variant={Button.Variant.TERTIARY} squareRadius>
              Cancel
            </Button>

            <Button type="submit" variant={Button.Variant.PRIMARY} disabled={!form.isValid} isLoading={form.isSubmitting}>
              Add Card
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    );
  })
);

export default BillingAddCard;
