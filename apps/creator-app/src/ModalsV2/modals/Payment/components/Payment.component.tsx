import { BillingPeriod } from '@voiceflow/internal';
import { useAsyncMountUnmount, useSmartReducerV2 } from '@voiceflow/ui';
import React from 'react';

import * as Billing from '@/components/Billing';

import { Step } from '../constants';
import { PaymentModalAPIProps } from '../types';
import { PaymentModal } from './PaymentModal.component';

export const Payment = ({ promptType, isTrialExpired, ...modalProps }: PaymentModalAPIProps) => {
  // TODO (chargebee billing): editor sets selector
  const usedEditorSeats = 1;
  const viewerSeats = 1;
  const editorPlanSeatLimits = 1;

  const [state, stateAPI] = useSmartReducerV2({
    step: Step.PLAN,
    period: BillingPeriod.ANNUALLY,
    editorSeats: usedEditorSeats,
    viewerSeats,
  });

  const onBack = () => {};

  const onContactSales = () => {};

  const onSubmitCard = async (_: Billing.CardForm.Values) => {
    // TODO (chargebee billing): implement submit card
  };

  const onBillingNext = () => {};

  useAsyncMountUnmount(async () => {
    // TODO (chargebee billing): track upgrade modal open
    // TODO (chargebee billing): fetch plan prices
  });

  const proPrices = null;
  const periodPrice = (proPrices?.[state.period] ?? 0) * (state.period === BillingPeriod.ANNUALLY ? 12 : 1);
  const price = periodPrice * state.editorSeats;
  const hasCards = true;

  return (
    <PaymentModal
      hasCard={!!hasCards}
      periodPrice={periodPrice}
      price={price}
      prices={proPrices}
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
      {...modalProps}
    />
  );
};
