import { Button, Modal, SectionV2, withProvider } from '@voiceflow/ui';
import { useFormik } from 'formik';
import React from 'react';

import * as Billing from '@/components/Billing';
import * as PaymentContext from '@/contexts/PaymentContext';

import manager from '../../manager';

interface AddCardProps {
  update?: boolean;
}

const AddCard = manager.create<AddCardProps>('LegacyBillingAddCard', () =>
  withProvider(PaymentContext.legacy.PaymentProvider)(({ api, type, opened, hidden, update, animated }) => {
    const paymentAPI = PaymentContext.legacy.usePaymentAPI();

    const onSubmitForm = async (values: PaymentContext.legacy.CardHolderInfo) => {
      api.preventClose();

      const source = await paymentAPI.createFullSource(values);
      await paymentAPI.updateWorkspaceSource(source);

      api.enableClose();
      api.close();
    };

    const form = useFormik({
      onSubmit: onSubmitForm,
      initialValues: Billing.CardForm.INITIAL_VALUES,
      validationSchema: Billing.CardForm.SCHEME,
      enableReinitialize: true,
    });

    return (
      <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={500}>
        <form onSubmit={form.handleSubmit}>
          <Modal.Header actions={<Modal.Header.CloseButton onClick={api.onClose} />} border>
            <Modal.Header.Title large>Add Card</Modal.Header.Title>
          </Modal.Header>

          <SectionV2.SimpleSection headerProps={{ topUnit: 3 }}>
            <Billing.CardForm.Base form={form} disabled={form.isSubmitting} />
          </SectionV2.SimpleSection>

          <Modal.Footer gap={8}>
            <Button onClick={api.onClose} variant={Button.Variant.TERTIARY} squareRadius>
              Cancel
            </Button>

            <Button type="submit" variant={Button.Variant.PRIMARY} disabled={form.isSubmitting} isLoading={form.isSubmitting}>
              {update ? 'Update Card' : 'Add Card'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    );
  })
);

export default AddCard;
