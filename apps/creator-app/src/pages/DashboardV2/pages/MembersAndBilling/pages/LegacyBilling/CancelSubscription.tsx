import { Box, Button, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import Page from '@/components/Page';
import * as ModalsV2 from '@/ModalsV2';
import type { PlanSubscription } from '@/models';

interface CancelSubscriptionProps {
  planSubscription: PlanSubscription | null;
}

const CancelSubscription: React.FC<CancelSubscriptionProps> = ({ planSubscription }) => {
  const cancelModal = ModalsV2.useModal(ModalsV2.Legacy.Billing.CancelSubscription);
  const isCancelable = !planSubscription?.cancelAtPeriodEnd;

  const handleClick = () => isCancelable && cancelModal.openVoid();

  return (
    <Page.Section
      mb={0}
      header={
        <Page.Section.Header>
          <Box.FlexApart>
            <div>
              <Page.Section.Title>Cancel Subscription</Page.Section.Title>
              <Page.Section.Description>
                Pro features will be available until the end of the current billing cycle.
              </Page.Section.Description>
            </div>

            <TippyTooltip
              content={`Workspace scheduled to be downgraded on ${planSubscription?.nextBillingDate}`}
              disabled={isCancelable}
              width={400}
            >
              <Button disabled={!isCancelable} variant={Button.Variant.SECONDARY} onClick={handleClick}>
                Cancel Subscription
              </Button>
            </TippyTooltip>
          </Box.FlexApart>
        </Page.Section.Header>
      }
    />
  );
};

export default CancelSubscription;
