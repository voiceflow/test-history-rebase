import { PlanType } from '@voiceflow/internal';
import { Box, Button, Modal, System, toast, withProvider } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import { PRICING_LINK } from '@/constants/link.constant';
import * as Payment from '@/contexts/PaymentContext';
import { useTrackingEvents } from '@/hooks/tracking';
import { useActiveWorkspace } from '@/hooks/workspace';

import manager from '../../../manager';

const CancelSubscription = manager.create('LegacyBillingCancelSubscription', () =>
  withProvider(Payment.legacy.PaymentProvider)(({ api, type, opened, hidden, animated, closePrevented }) => {
    const workspace = useActiveWorkspace();
    const [tracking] = useTrackingEvents();
    const paymentAPI = Payment.legacy.usePaymentAPI();

    const onCancel = async () => {
      if (!workspace) return;

      api.preventClose();

      try {
        await client.workspace.cancelSubscription(workspace.id);

        await paymentAPI.refetchPlanSubscription();
        tracking.trackPlanChanged({ currentPlan: workspace.plan ?? PlanType.PRO, newPlan: PlanType.STARTER });
        toast.success(`Subscription cancelled. Pro features will be available until ${paymentAPI.planSubscription?.nextBillingDate}`);
        api.enableClose();
        api.close();
      } catch {
        api.enableClose();

        toast.error("Couldn't cancel subscription, please try again later.");
      }
    };

    return (
      <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={400}>
        <Modal.Header actions={<Modal.Header.CloseButtonAction onClick={api.onClose} />}>Cancel Subscription</Modal.Header>

        <Modal.Body centered>
          <Box>
            Downgrading will result in limited feature access. We recommend you review the{' '}
            <System.Link.Anchor href={PRICING_LINK}>pricing page</System.Link.Anchor> to see what's included in our tiers. If you're all set, click
            the button below to cancel your subscription.
          </Box>
        </Modal.Body>

        <Modal.Footer gap={12}>
          <Button onClick={api.onClose} variant={Button.Variant.TERTIARY} squareRadius disabled={closePrevented}>
            Cancel
          </Button>

          <Button squareRadius onClick={onCancel} disabled={closePrevented}>
            Downgrade to Free
          </Button>
        </Modal.Footer>
      </Modal>
    );
  })
);

export default CancelSubscription;
