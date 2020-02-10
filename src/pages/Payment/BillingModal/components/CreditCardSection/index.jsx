import React from 'react';

import client from '@/client';
import Input from '@/componentsV2/Input';
import { CardElement } from '@/componentsV2/Stripe';
import { toast } from '@/componentsV2/Toast';
import { withStripe } from '@/hocs';
import { useAsyncMountUnmount } from '@/hooks';

import { Container, Heading } from '../InfoSectionComponents';
import InputContainer from './components/InputContainer';

const parseError = (err) => {
  let error;
  if (err?.body?.errors) {
    error = Object.keys(err.body.errors)
      .map((key) => err.body.errors[key].message)
      .join('\n');
  }
  return error;
};

function CreditCardSection({ setStripeCompleted, workspaceId, stripe, checkChargeable }) {
  const [paymentSource, setPaymentSource] = React.useState(null);
  const [usingExistingSource, setUsingExistingSource] = React.useState(true);
  const [updatingSource, setUpdatingSource] = React.useState(false);

  useAsyncMountUnmount(async () => {
    const { source } = await client.workspace.getPlan(workspaceId);
    setPaymentSource(source || null);
    setUsingExistingSource(!!source);
  });

  const handleSuccessfulUpdate = (newSource) => {
    toast.success('Successfully Updated Credit Card!');
    setPaymentSource(newSource.card);
    setUsingExistingSource(true);
  };

  const updateSource = async () => {
    if (updatingSource) return;
    try {
      setUpdatingSource(true);
      const stripeSource = await stripe.createSource({
        type: 'card',
      });
      const newSource = stripeSource.source;

      if (!newSource) {
        return toast.error('Invalid Card Information');
      }
      await checkChargeable(newSource);
      await client.workspace.updateSource(workspaceId, newSource.id);
      handleSuccessfulUpdate(newSource);
    } catch (err) {
      const error = parseError(err);
      toast.error(error || err?.data?.data || err?.message);
    } finally {
      setUpdatingSource(false);
    }
  };

  const actions = [{ label: usingExistingSource ? 'Update card' : 'Cancel', action: () => setUsingExistingSource(!usingExistingSource) }];

  if (!usingExistingSource) {
    actions.push({ label: !updatingSource ? 'Update' : 'Updating...', action: updateSource });
  }

  return (
    <Container>
      <Heading heading="Payment Option" actions={actions} />
      <InputContainer>
        {usingExistingSource && paymentSource ? (
          <Input icon="creditCard" value={`${paymentSource.brand} | XXXX-XXXX-XXXX-${paymentSource.last4}`} disabled />
        ) : (
          <CardElement disabled={updatingSource} onChangeComplete={setStripeCompleted} />
        )}
      </InputContainer>
    </Container>
  );
}

export default withStripe(CreditCardSection);
