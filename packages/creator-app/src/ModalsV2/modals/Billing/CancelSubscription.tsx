import { Box, Button, Link, Modal, toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import { PLAN_INFO_LINK } from '@/constants';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks/redux';

import manager from '../../manager';

const Cancel = manager.create('BillingCancel', () => ({ api, type, opened, hidden, animated, closePrevented }) => {
  const workspaceID = useSelector(Session.activeWorkspaceIDSelector)!;

  const onCancel = async () => {
    api.preventClose();

    try {
      await client.workspace.cancelSubscription(workspaceID);

      api.enableClose();
      api.close();
    } catch {
      api.enableClose();

      toast.error("Couldn't cancel subscription, please try again later.");
    }
  };

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={400}>
      <Modal.Header actions={<Modal.Header.CloseButtonAction onClick={api.close} />}>Cancel Subscription</Modal.Header>

      <Modal.Body centered>
        <Box>
          Downgrading will result in limited feature access. We recommend you review the <Link link={PLAN_INFO_LINK}>pricing page</Link> to see what's
          included in our tiers. If you're all set, click the button below to cancel your subscription.
        </Box>
      </Modal.Body>

      <Modal.Footer gap={12}>
        <Button onClick={() => api.close()} variant={Button.Variant.TERTIARY} squareRadius disabled={closePrevented}>
          Cancel
        </Button>

        <Button squareRadius onClick={onCancel} disabled={closePrevented}>
          Downgrade to Free
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default Cancel;
