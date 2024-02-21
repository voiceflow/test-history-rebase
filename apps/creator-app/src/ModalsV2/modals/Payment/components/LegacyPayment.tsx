import { BillingPeriod } from '@voiceflow/internal';
import { toast, useAsyncMountUnmount, useSmartReducerV2 } from '@voiceflow/ui';
import React from 'react';

import * as Billing from '@/components/Billing';
import { ACTIVE_PAID_PLAN, UNLIMITED_EDITORS_CONST } from '@/constants';
import * as Payment from '@/contexts/PaymentContext';
import { PlanPricesContext } from '@/contexts/PlanPricesContext';
import * as Sessions from '@/ducks/session';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useTrackingEvents } from '@/hooks';
import { useDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';
import { getErrorMessage } from '@/utils/error';
import { onOpenBookDemoPage } from '@/utils/upgrade';

import { Step } from '../constants';
import { PaymentModalAPIProps } from '../types';
import { PaymentModal } from './PaymentModal.component';

const LegacyPayment = ({ id, api, type, opened, hidden, animated, closePrevented, promptType, isTrialExpired }: PaymentModalAPIProps) => {
  const paymentAPI = Payment.legacy.usePaymentAPI();
  const planPrices = React.useContext(PlanPricesContext);
  const [trackingEvents] = useTrackingEvents();

  const editorSeats = useSelector(WorkspaceV2.active.usedEditorSeatsSelector);
  const viewerSeats = useSelector(WorkspaceV2.active.usedViewerSeatsSelector);
  const numberOfSeats = useSelector(WorkspaceV2.active.numberOfSeatsSelector);
  const editorPlanSeatLimits = useSelector(WorkspaceV2.active.editorPlanSeatLimitsSelector);
  const activeWorkspaceID = useSelector(Sessions.activeWorkspaceIDSelector);

  const workspaceEditorSeats = numberOfSeats === UNLIMITED_EDITORS_CONST ? editorSeats : numberOfSeats;

  const checkoutWorkspace = useDispatch(WorkspaceV2.checkout);

  const [state, stateAPI] = useSmartReducerV2({
    step: Step.PLAN,
    period: BillingPeriod.ANNUALLY,
    editorSeats: workspaceEditorSeats,
    viewerSeats,
  });

  const onBack = () => stateAPI.step.set(state.step === Step.BILLING ? Step.PLAN : Step.BILLING);

  const onContactSales = () => {
    if (promptType) {
      trackingEvents.trackContactSales({ promptType });
    }

    onOpenBookDemoPage();
  };

  const onCheckout = async (sourceID?: string) => {
    if (!activeWorkspaceID) return;

    api.preventClose();

    try {
      // TODO: probably we should use billing service instead
      await checkoutWorkspace({
        plan: ACTIVE_PAID_PLAN,
        seats: state.editorSeats,
        period: state.period,
        sourceID: sourceID ?? '',
        workspaceID: activeWorkspaceID,
      });

      if (isTrialExpired) {
        trackingEvents.trackTrialExpiredUpgrade({ editorSeats: state.editorSeats });
      }
      api.enableClose();
      api.close();

      toast.success('Upgraded to Pro!');
    } catch (error) {
      api.enableClose();
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const onSubmitCard = async (cardValues: Billing.CardForm.Values) => {
    api.preventClose();

    let sourceID: string | undefined;

    try {
      const source = await paymentAPI.createFullSource(cardValues);

      sourceID = source.id;
    } catch (err) {
      toast.error(getErrorMessage(err));
      return;
    }

    await onCheckout(sourceID);
  };

  const onBillingNext = () => {
    if (paymentAPI.paymentSource) {
      onCheckout();

      return;
    }

    stateAPI.step.set(Step.PAYMENT);
  };

  useAsyncMountUnmount(async () => {
    trackingEvents.trackUpgradeModal();

    try {
      await planPrices.get();
    } catch {
      if (!planPrices.map) {
        toast.error('Failed to load plans');
      }
    }
  });

  const proPrices = planPrices.map[ACTIVE_PAID_PLAN] ?? null;
  const periodPrice = (proPrices?.[state.period] ?? 0) * (state.period === BillingPeriod.ANNUALLY ? 12 : 1);
  const price = periodPrice * state.editorSeats;

  return (
    <PaymentModal
      animated={animated}
      api={api}
      closePrevented={closePrevented}
      hasCard={!!paymentAPI.paymentSource}
      hidden={hidden}
      opened={opened}
      periodPrice={periodPrice}
      price={price}
      prices={proPrices}
      state={state}
      stateAPI={stateAPI}
      type={type}
      id={id}
      usedEditorSeats={workspaceEditorSeats}
      editorPlanSeatLimits={editorPlanSeatLimits}
      isTrialExpired={isTrialExpired}
      promptType={promptType}
      paymentGateway="stripe"
      onSubmitCard={onSubmitCard}
      onBack={onBack}
      onBillingNext={onBillingNext}
      onContactSales={onContactSales}
    />
  );
};

export default LegacyPayment;
