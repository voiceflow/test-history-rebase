import React from 'react';

import client from '@/client';
import Box from '@/components/Box';
import Input from '@/components/Input';
import Section, { SectionVariant } from '@/components/Section';
import { CardElement } from '@/components/Stripe';
import { toast } from '@/components/Toast';
import { withStripe } from '@/hocs';
import { useAsyncMountUnmount } from '@/hooks';
import { ActionMapping } from '@/pages/Payment/Checkout/components/StepHeading';

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
    <Section header="Credit Card" variant={SectionVariant.QUATERNARY} suffix={<ActionMapping actions={actions} />}>
      <Box mb={32}>
        {usingExistingSource && paymentSource ? (
          <Input icon="creditCard" value={`${paymentSource.brand} | XXXX-XXXX-XXXX-${paymentSource.last4}`} disabled />
        ) : (
          <CardElement disabled={updatingSource} onChangeComplete={setStripeCompleted} />
        )}
      </Box>
    </Section>
  );
}

export default withStripe(CreditCardSection);
