import { Box, Input, toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import Section, { SectionVariant } from '@/components/Section';
import { CardElement } from '@/components/Stripe';
import { withStripe } from '@/hocs/withStripe';
import { useAsyncMountUnmount } from '@/hooks';
import { DBPaymentSource } from '@/models/Billing';
import { ActionMapping } from '@/pages/Payment/Checkout/components/StepHeading';

const parseError = (err: any) => {
  let error;
  if (err?.body?.errors) {
    error = Object.keys(err.body.errors)
      .map((key) => err.body.errors[key].message)
      .join('\n');
  }
  return error;
};

export interface CreditCardSectionProps {
  stripe: stripe.Stripe;
  workspaceId: string;
  checkChargeable: (data: stripe.Source) => Promise<void>;
  setStripeCompleted?: (complete: boolean) => void;
}

const CreditCardSection: React.FC<CreditCardSectionProps> = ({ setStripeCompleted, workspaceId, stripe, checkChargeable }) => {
  const [paymentSource, setPaymentSource] = React.useState<DBPaymentSource | null>();
  const [usingExistingSource, setUsingExistingSource] = React.useState(true);
  const [updatingSource, setUpdatingSource] = React.useState(false);

  useAsyncMountUnmount(async () => {
    const plan = await client.workspace.getPlan(workspaceId);
    setPaymentSource(plan.source ?? null);
    setUsingExistingSource(!!plan.source);
  });

  const handleSuccessfulUpdate = (newSource: any) => {
    toast.success('Successfully Updated Credit Card!');
    setPaymentSource(newSource.card);
    setUsingExistingSource(true);
  };

  const updateSource = async () => {
    if (updatingSource) return;

    try {
      setUpdatingSource(true);
      const stripeSource = await stripe.createSource({ type: 'card' });
      const newSource = stripeSource.source;

      if (!newSource) {
        toast.error('Invalid Card Information');
        return;
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
};

export default withStripe(CreditCardSection) as React.FC<Omit<CreditCardSectionProps, 'stripe' | 'checkChargeable'>>;
