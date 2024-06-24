import { PlanName } from '@voiceflow/dtos';
import { FeatureFlag } from '@voiceflow/realtime-sdk';
import { Modal, Switch, System, useAsyncMountUnmount, withProvider } from '@voiceflow/ui';
import { useSetAtom } from 'jotai';
import React from 'react';

import { DEFAULT_PERIOD } from '@/constants';
import { PlansProvider, usePlans } from '@/contexts/Plans/Plans.context';
import * as Organization from '@/ducks/organization';
import { useSelector } from '@/hooks';
import { useFeature } from '@/hooks/feature.hook';

import * as atoms from '../../../../contexts/Plans/Plans.atoms';
import manager from '../../../manager';
import { BillingStep } from './BillingStep/BillingStep.component';
import { usePaymentSteps } from './hooks';
import { Step } from './Payment.constants';
import { PaymentModalProps } from './Payment.types';
import { PaymentStep } from './PaymentStep/PaymentStep.component';
import { PlanStep } from './PlanStep/PlanStep.component';

export const Payment = manager.create<PaymentModalProps>('Payment', () =>
  withProvider(PlansProvider)((modalProps) => {
    const { type, opened, hidden, animated, api, closePrevented, promptType, nextPlan } = modalProps;
    const { activeStep, onBack, onReset } = usePaymentSteps();
    const { plans } = usePlans();
    const setPeriod = useSetAtom(atoms.selectedPeriodAtom);
    const setPlan = useSetAtom(atoms.selectedPlanIDAtom);
    const subscription = useSelector(Organization.chargebeeSubscriptionSelector);
    const teamsPlanSelfServeIsEnabled = useFeature(FeatureFlag.TEAMS_PLAN_SELF_SERVE);

    const handleExited = () => {
      onReset();
      api.remove();
    };

    useAsyncMountUnmount(async () => {
      setPeriod(DEFAULT_PERIOD);

      if (teamsPlanSelfServeIsEnabled) {
        const defaultNextPlan =
          subscription?.plan === PlanName.STARTER || subscription?.trial ? PlanName.PRO : PlanName.TEAM;

        setPlan(nextPlan ?? defaultNextPlan);
      }
    });

    if (!plans?.length) return null;

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
            <PlanStep promptType={promptType} onClose={api.onClose} />
          </Switch.Pane>

          <Switch.Pane value={Step.BILLING}>
            <BillingStep isLoading={closePrevented} />
          </Switch.Pane>

          <Switch.Pane value={Step.PAYMENT}>
            <PaymentStep onClose={api.onClose} modalProps={modalProps} />
          </Switch.Pane>
        </Switch>
      </Modal>
    );
  })
);
