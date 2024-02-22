import { Modal, Switch } from '@ui/components';
import { System, useAsyncMountUnmount, useSmartReducerV2 } from '@ui/index';
import { BillingPlan } from '@voiceflow/dtos';
import { BillingPeriod } from '@voiceflow/internal';
import { atom, useAtom } from 'jotai';
import React from 'react';

import { designerClient } from '@/client/designer';
import * as Organization from '@/ducks/organization';
import { UpgradePrompt } from '@/ducks/tracking';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector, useTrackingEvents } from '@/hooks';
import { onOpenBookDemoPage } from '@/utils/upgrade';
import { getClient as getChargebeeClient, initialize as initializeChargebee } from '@/vendors/chargebee';

import manager from '../../../manager';
import { BillingStep, PaymentStep, PlanStep } from './components';
import * as CardForm from './components/CardForm';
import { Step } from './Payment.constants';

export interface PaymentModalProps {
  promptType?: UpgradePrompt;
  isTrialExpired?: boolean;
}

const proPlanPrices = atom<Record<BillingPeriod, number>>({
  [BillingPeriod.MONTHLY]: 0,
  [BillingPeriod.ANNUALLY]: 0,
});

export const Payment = manager.create<PaymentModalProps>('Payment', () => ({ type, opened, hidden, animated, api, closePrevented, promptType }) => {
  const subscription = useSelector(Organization.chargebeeSubscriptionSelector);
  const [trackingEvents] = useTrackingEvents();
  const organizationID = useSelector(WorkspaceV2.active.organizationIDSelector);

  const [prices, setPrices] = useAtom(proPlanPrices);

  const { editorSeats = 0, planSeatLimits } = subscription || {};
  const usedEditorSeats = editorSeats;
  const viewerSeats = planSeatLimits?.viewer ?? 0;
  const editorPlanSeatLimits = planSeatLimits?.editor ?? 0;
  const hasCard = true;
  const proPrices = prices;
  const price = prices[BillingPeriod.ANNUALLY];

  const [state, stateAPI] = useSmartReducerV2({
    step: Step.PLAN,
    period: BillingPeriod.ANNUALLY,
    editorSeats: usedEditorSeats,
    viewerSeats,
  });

  const periodPrice = state.period === BillingPeriod.ANNUALLY ? prices[state.period] * 12 : prices[state.period];

  const onBack = () => stateAPI.step.set(state.step === Step.BILLING ? Step.PLAN : Step.BILLING);

  const onContactSales = () => {
    if (promptType) {
      trackingEvents.trackContactSales({ promptType });
    }

    onOpenBookDemoPage();
  };

  const onSubmitCard = async (card: CardForm.Values) => {
    if (!organizationID) return;

    api.preventClose();

    try {
      await designerClient.billing.billing.upsertCard(organizationID, {
        json: {
          firstName: card.name,
          lastLame: card.name,
          billingAddr1: card.address,
          billingCity: card.city,
          billingState: card.state,
          billingCountry: card.country,
          tempToken: card.cardAuthorization?.token,
        },
      });
    } finally {
      api.enableClose();
      api.close();
    }
  };

  const onBillingNext = () => {
    stateAPI.step.set(Step.PAYMENT);
  };

  const fetchPlans = async () => {
    const { billing: billingClient } = designerClient.billing;
    const plans = (await billingClient.getAllPlans()) as BillingPlan[];
    const proPlan = plans.find((plan) => plan.id === 'pro');
    const monthlyProPlanPrice = proPlan?.price.find((p) => p.period === BillingPeriod.MONTHLY)?.price;
    const annuallyProPlanPrice = proPlan?.price.find((p) => p.period === BillingPeriod.ANNUALLY)?.price;

    setPrices({
      [BillingPeriod.MONTHLY]: monthlyProPlanPrice ?? 0,
      [BillingPeriod.ANNUALLY]: annuallyProPlanPrice ? annuallyProPlanPrice / 12 : 0,
    });
  };

  useAsyncMountUnmount(async () => {
    // TODO (chargebee billing): track upgrade modal open
    await fetchPlans();

    try {
      getChargebeeClient();
    } catch (e) {
      initializeChargebee();
    }
  });

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={500}>
      <Modal.Header actions={<Modal.Header.CloseButtonAction disabled={closePrevented} onClick={api.onClose} />} capitalizeText={false}>
        {state.step !== Step.PLAN && (
          <System.IconButtonsGroup.Base mr={12}>
            <System.IconButton.Base icon="largeArrowLeft" disabled={closePrevented} onClick={onBack} />
          </System.IconButtonsGroup.Base>
        )}

        <Modal.Header.Title large>Choose a Plan</Modal.Header.Title>
      </Modal.Header>

      <Switch active={state.step}>
        <Switch.Pane value={Step.PLAN}>
          <PlanStep
            period={state.period}
            prices={proPrices}
            onNext={() => stateAPI.step.set(Step.BILLING)}
            onClose={api.onClose}
            onContactSales={onContactSales}
          />
        </Switch.Pane>

        <Switch.Pane value={Step.BILLING}>
          <BillingStep
            price={price}
            period={state.period}
            prices={proPrices}
            onNext={onBillingNext}
            onBack={onBack}
            onClose={api.onClose}
            hasCard={!!hasCard}
            isLoading={closePrevented}
            periodPrice={periodPrice}
            editorSeats={state.editorSeats}
            viewerSeats={state.viewerSeats}
            onChangePeriod={stateAPI.period.set}
            usedEditorSeats={usedEditorSeats}
            onChangeEditorSeats={stateAPI.editorSeats.set}
            editorPlanSeatLimits={editorPlanSeatLimits}
          />
        </Switch.Pane>

        <Switch.Pane value={Step.PAYMENT}>
          <PaymentStep period={state.period} price={price} onClose={api.onClose} onSubmit={onSubmitCard} editorSeats={state.editorSeats} />
        </Switch.Pane>
      </Switch>
    </Modal>
  );
});
