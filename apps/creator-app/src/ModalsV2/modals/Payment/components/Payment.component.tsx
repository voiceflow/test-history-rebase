import { BillingPeriod } from '@voiceflow/internal';
import { useAsyncMountUnmount, useSmartReducerV2 } from '@voiceflow/ui';
import { atom, useAtom } from 'jotai';
import React from 'react';

import { designerClient } from '@/client/designer';
import * as Billing from '@/components/Billing';
import * as Organization from '@/ducks/organization';
import { useSelector, useTrackingEvents } from '@/hooks';
import { onOpenBookDemoPage } from '@/utils/upgrade';
import { getClient as getChargebeeClient, initialize as initializeChargebee } from '@/vendors/chargebee';

import { Step } from '../constants';
import { PaymentModalAPIProps } from '../types';
import { PaymentModal } from './PaymentModal.component';

const proPlanPrices = atom<Record<BillingPeriod, number>>({
  [BillingPeriod.MONTHLY]: 0,
  [BillingPeriod.ANNUALLY]: 0,
});

export const Payment = ({ promptType, isTrialExpired, ...modalProps }: PaymentModalAPIProps) => {
  const subscription = useSelector(Organization.chargebeeSubscriptionSelector);
  const [trackingEvents] = useTrackingEvents();

  const [prices, setPrices] = useAtom(proPlanPrices);

  const { editorSeats = 0, planSeatLimits } = subscription || {};
  const usedEditorSeats = editorSeats;
  const viewerSeats = planSeatLimits?.viewer ?? 0;
  const editorPlanSeatLimits = planSeatLimits?.editor ?? 0;

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

  const onSubmitCard = async (card: Billing.CardForm.Values) => {
    // TODO (chargebee billing): implement submit card
    // eslint-disable-next-line no-console
    console.log({ card });
  };

  const onBillingNext = () => {
    stateAPI.step.set(Step.PAYMENT);
  };

  const fetchPlans = async () => {
    const plans = await designerClient.billing.plan.getAllPlans();
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
    <PaymentModal
      hasCard={false}
      periodPrice={periodPrice}
      price={periodPrice}
      prices={prices}
      state={state}
      stateAPI={stateAPI}
      usedEditorSeats={usedEditorSeats}
      editorPlanSeatLimits={editorPlanSeatLimits}
      isTrialExpired={isTrialExpired}
      promptType={promptType}
      onSubmitCard={onSubmitCard}
      onBack={onBack}
      onBillingNext={onBillingNext}
      onContactSales={onContactSales}
      paymentGateway="chargebee"
      {...modalProps}
    />
  );
};
