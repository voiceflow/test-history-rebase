import { PlanType } from '@voiceflow/internal';
import { FeatureFlag } from '@voiceflow/realtime-sdk';
import { Badge, BlockText, Box, Button, Link, Modal } from '@voiceflow/ui';
import { useAtom, useAtomValue } from 'jotai';
import React from 'react';

import { UpgradePrompt } from '@/ducks/tracking';
import * as Workspace from '@/ducks/workspaceV2';
import { useFeature, useSelector, useTrackingEvents } from '@/hooks';
import { onOpenBookDemoPage } from '@/utils/upgrade';

import { usePaymentSteps, usePlans } from '../hooks';
import { selectedPeriodAtom, selectedPlanIDAtom } from '../Payment.atoms';
import { PlanCard } from '../PlanCard/PlanCard.component';

interface PlanStepProps {
  promptType?: UpgradePrompt;
  onClose: VoidFunction;
}

export const PlanStep: React.FC<PlanStepProps> = ({ onClose, promptType }) => {
  const [trackingEvents] = useTrackingEvents();
  const [selectedPlanID, setSelectedPlanID] = useAtom(selectedPlanIDAtom);
  const period = useAtomValue(selectedPeriodAtom);

  const { plans } = usePlans();

  const { onNext } = usePaymentSteps();
  const plan = useSelector(Workspace.active.planSelector);
  const isOnPaidPlan = useSelector(Workspace.active.isOnPaidPlanSelector);
  const isOnTrial = useSelector(Workspace.active.isOnTrialSelector);
  const { isEnabled: teamsPlanSelfServeIsEnabled } = useFeature(FeatureFlag.TEAMS_PLAN_SELF_SERVE);

  const onContactSales = () => {
    if (promptType) {
      trackingEvents.trackContactSales({ promptType });
    }

    onOpenBookDemoPage();
  };

  const isPopular = (id: string) => id === PlanType.PRO;

  return (
    <>
      <Modal.Body>
        <Box.Flex mb={20} gap={16} column fullWidth>
          {(!isOnPaidPlan || isOnTrial) && (
            <PlanCard title="Free" badge={<Badge.Descriptive color="gray">Current</Badge.Descriptive>} amount={0}>
              For individuals and hobbyists creating a single agent.{' '}
              <Link href="https://www.voiceflow.com/pricing" $hidden>
                View details
              </Link>
            </PlanCard>
          )}

          {plans.map(({ id, name, pricesByPeriodUnit, description }) => (
            <PlanCard
              key={id}
              title={name}
              badge={
                // eslint-disable-next-line no-nested-ternary
                id === plan && !isOnTrial ? (
                  <Badge.Descriptive color="gray">Current</Badge.Descriptive>
                ) : isPopular(id) && !teamsPlanSelfServeIsEnabled ? (
                  <Badge.Descriptive>Popular</Badge.Descriptive>
                ) : null
              }
              amount={pricesByPeriodUnit?.[period]?.monthlyAmount ?? 0}
              active={selectedPlanID === id}
              onClick={id === plan && !isOnTrial ? undefined : () => setSelectedPlanID(id)}
            >
              {teamsPlanSelfServeIsEnabled ? description : 'For individuals and small teams creating agents'}{' '}
              <Link href="https://www.voiceflow.com/pricing" $hidden>
                View details
              </Link>
            </PlanCard>
          ))}
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
};
