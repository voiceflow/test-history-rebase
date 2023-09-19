import { BillingPeriod } from '@voiceflow/internal';
import { Modal, Switch, System, useAsyncMountUnmount, useSmartReducerV2 } from '@voiceflow/ui';
import { toast } from '@voiceflow/ui-next';
import React from 'react';

import * as Billing from '@/components/Billing';
import { ACTIVE_PAID_PLAN, UNLIMITED_EDITORS_CONST } from '@/constants';
import { usePaymentAPI } from '@/contexts/PaymentContext';
import { PlanPricesContext } from '@/contexts/PlanPricesContext';
import * as Sessions from '@/ducks/session';
import * as Tracking from '@/ducks/tracking';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';
import { useTrackingEvents } from '@/hooks/tracking';
import { VoidInternalProps } from '@/ModalsV2/types';
import { getErrorMessage } from '@/utils/error';
import { onOpenBookDemoPage } from '@/utils/upgrade';

import { Step } from '../constants';
import BillingStep from './BillingStep';
import PaymentStep from './PaymentStep';
import PlanStep from './PlanStep';

interface PaymentProps extends VoidInternalProps {
  promptType?: Tracking.UpgradePrompt;
  isTrialExpired?: boolean;
}

const Payment = ({ api, type, opened, hidden, animated, closePrevented, promptType, isTrialExpired }: PaymentProps) => {
  const paymentAPI = usePaymentAPI();
  const planPrices = React.useContext(PlanPricesContext);
  const [trackingEvents] = useTrackingEvents();

  const editorSeats = useSelector(WorkspaceV2.active.usedEditorSeatsSelector);
  const viewerSeats = useSelector(WorkspaceV2.active.usedViewerSeatsSelector);
  const numberOfSeats = useSelector(WorkspaceV2.active.numberOfSeatsSelector);
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
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={500}>
      <Modal.Header actions={<Modal.Header.CloseButtonAction disabled={closePrevented} onClick={() => api.close()} />} capitalizeText={false}>
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
            onClose={api.close}
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
            onClose={api.close}
            hasCard={!!paymentAPI.paymentSource}
            isLoading={closePrevented}
            periodPrice={periodPrice}
            editorSeats={state.editorSeats}
            viewerSeats={state.viewerSeats}
            onChangePeriod={stateAPI.period.set}
            usedEditorSeats={workspaceEditorSeats}
            onChangeEditorSeats={stateAPI.editorSeats.set}
          />
        </Switch.Pane>

        <Switch.Pane value={Step.PAYMENT}>
          <PaymentStep period={state.period} price={price} onClose={api.close} onSubmit={onSubmitCard} editorSeats={state.editorSeats} />
        </Switch.Pane>
      </Switch>
    </Modal>
  );
};

export default Payment;
