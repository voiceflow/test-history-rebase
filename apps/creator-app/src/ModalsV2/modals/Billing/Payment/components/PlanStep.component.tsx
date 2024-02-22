import { BillingPeriod } from '@voiceflow/internal';
import { Badge, BlockText, Box, Button, Link, Modal } from '@voiceflow/ui';
import React from 'react';

import { PlanCard } from './PlanCard.component';

interface PlanStepProps {
  onNext: VoidFunction;
  period: BillingPeriod;
  prices: Record<BillingPeriod, number> | null;
  onClose: VoidFunction;
  onContactSales: VoidFunction;
}

export const PlanStep: React.FC<PlanStepProps> = ({ onNext, onClose, period, prices, onContactSales }) => (
  <>
    <Modal.Body>
      <Box.Flex mb={20} gap={16} column fullWidth>
        <PlanCard title="Free" badge={<Badge.Descriptive color="gray">Current</Badge.Descriptive>} price={0}>
          For individuals and hobbyists creating a single assistant.{' '}
          <Link href="https://www.voiceflow.com/pricing" $hidden>
            View details
          </Link>
        </PlanCard>

        <PlanCard title="Pro" badge={<Badge.Descriptive>Popular</Badge.Descriptive>} price={prices?.[period] ?? null} active>
          For individuals and small teams creating assistants.{' '}
          <Link href="https://www.voiceflow.com/pricing" $hidden>
            View details
          </Link>
        </PlanCard>
      </Box.Flex>

      <Box.FlexApart fullWidth justifyContent="center">
        <div>
          <BlockText mb={2} fontWeight={600}>
            Enterprise
          </BlockText>

          <BlockText fontSize={13} color="#62778C">
            Need more? Lets create a plan together.
          </BlockText>
        </div>

        <Button onClick={() => onContactSales()} variant={Button.Variant.QUATERNARY} squareRadius>
          Contact Sales
        </Button>
      </Box.FlexApart>
    </Modal.Body>

    <Modal.Footer gap={12}>
      <Button onClick={() => onClose()} variant={Button.Variant.TERTIARY} squareRadius>
        Cancel
      </Button>

      <Button onClick={() => onNext()} variant={Button.Variant.PRIMARY} squareRadius>
        Continue to Billing
      </Button>
    </Modal.Footer>
  </>
);
