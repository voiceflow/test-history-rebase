import type { BillingPeriodUnit } from '@voiceflow/dtos';
import { PlanName } from '@voiceflow/dtos';
import { Modal, Switch, System } from '@voiceflow/ui';
import React, { useEffect, useMemo, useState } from 'react';

import { designerClient } from '@/client/designer';
import { DEFAULT_PERIOD } from '@/constants';
import { allPlansSelector } from '@/ducks/billing-plan/billing-plan.select';
import * as Organization from '@/ducks/organization';
import type { UpgradePrompt } from '@/ducks/tracking';
import { useSelector } from '@/hooks';
import { useFetch } from '@/hooks/fetch.hook';

import manager from '../../../manager';
import { BillingStep } from './BillingStep/BillingStep.component';
import { usePaymentSteps } from './hooks/steps.hook';
import { Step } from './Payment.constants';
import { PaymentStep } from './PaymentStep/PaymentStep.component';
import { PlanStep } from './PlanStep/PlanStep.component';

export interface PaymentModalProps {
  promptType?: UpgradePrompt;
  isTrialExpired?: boolean;
  nextPlan?: PlanName;
  couponID?: string;
}

export const Payment = manager.create<PaymentModalProps>('Payment', () => (modalProps) => {
  const { type, opened, hidden, animated, api, closePrevented, promptType, nextPlan, couponID } = modalProps;
  const { activeStep, onBack, onReset, onNext } = usePaymentSteps();

  const subscription = useSelector(Organization.chargebeeSubscriptionSelector);

  const reduxPlans = useSelector(allPlansSelector);

  const { data: couponPlans, fetch: fetchPlans } = useFetch(() =>
    designerClient.billing.plan.getPlans({
      planIDs: [PlanName.PRO, PlanName.TEAM],
      coupons: couponID ? [couponID] : undefined,
    })
  );

  const plans = couponID ? couponPlans : reduxPlans;

  const [selectedPeriod, setSelectedPeriod] = useState<BillingPeriodUnit>(DEFAULT_PERIOD);
  const [selectedPlanID, setSelectedPlanID] = useState<PlanName>(() => {
    const { plan, trial } = subscription ?? {};
    const defaultNextPlan = plan === PlanName.STARTER || trial ? PlanName.PRO : PlanName.TEAM;

    return nextPlan ?? defaultNextPlan;
  });

  const selectedPlan = useMemo(
    () => plans?.find((plan) => plan.id === selectedPlanID) ?? null,
    [plans, selectedPlanID]
  );

  const selectedPlanPrice = selectedPlan?.pricesByPeriodUnit?.[selectedPeriod];

  const handleExited = () => {
    onReset();
    api.remove();
  };

  useEffect(() => {
    if (couponID) {
      fetchPlans();
    }
  }, []);

  if (!plans || !selectedPlan || !selectedPlanPrice) return null;

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={handleExited} maxWidth={500}>
      <Modal.Header
        actions={<Modal.Header.CloseButtonAction disabled={closePrevented} onClick={api.onClose} />}
        capitalizeText={false}
      >
        {activeStep !== Step.PLAN && (
          <System.IconButtonsGroup.Base mr={12}>
            <System.IconButton.Base icon="largeArrowLeft" disabled={closePrevented} onClick={onBack} />
          </System.IconButtonsGroup.Base>
        )}

        <Modal.Header.Title large>Choose a Plan</Modal.Header.Title>
      </Modal.Header>

      <Switch active={activeStep}>
        <Switch.Pane value={Step.PLAN}>
          <PlanStep
            promptType={promptType}
            onClose={api.onClose}
            plans={plans}
            planID={selectedPlanID}
            onChangePlanID={setSelectedPlanID}
            period={selectedPeriod}
            onNext={onNext}
          />
        </Switch.Pane>

        <Switch.Pane value={Step.BILLING}>
          <BillingStep
            isLoading={closePrevented}
            onChangePeriod={setSelectedPeriod}
            period={selectedPeriod}
            plan={selectedPlan}
            amount={selectedPlanPrice.amount}
            onBack={onBack}
            onNext={onNext}
          />
        </Switch.Pane>

        <Switch.Pane value={Step.PAYMENT}>
          <PaymentStep
            onClose={api.onClose}
            modalProps={modalProps}
            couponID={couponID}
            amount={selectedPlanPrice.amount}
            planPriceID={selectedPlanPrice.id}
            period={selectedPeriod}
            plan={selectedPlan}
          />
        </Switch.Pane>
      </Switch>
    </Modal>
  );
});
