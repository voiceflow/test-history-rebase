import { Modal, Switch, System } from '@voiceflow/ui';
import React from 'react';

import * as Billing from '@/components/Billing';

import { Step } from '../constants';
import { PaymentModalAPIProps, PaymentModalState, PaymentModalStateAPI, ProPrices } from '../types';
import BillingStep from './BillingStep';
import PaymentStep from './PaymentStep';
import PlanStep from './PlanStep';

export interface PaymentModalProps extends PaymentModalAPIProps {
  state: PaymentModalState;
  stateAPI: PaymentModalStateAPI;
  prices: ProPrices;
  price: number;
  hasCard: boolean;
  periodPrice: number;
  usedEditorSeats: number;
  editorPlanSeatLimits: number;
  onBillingNext: VoidFunction;
  onContactSales: VoidFunction;
  onBack: VoidFunction;
  // TODO: move billing types
  onSubmitCard: (values: Billing.CardForm.Values) => Promise<void>;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  usedEditorSeats,
  editorPlanSeatLimits,
  state,
  stateAPI,
  prices: proPrices,
  price,
  periodPrice,
  api,
  type,
  opened,
  hidden,
  animated,
  closePrevented,
  hasCard,
  onBack,
  onBillingNext,
  onContactSales,
  onSubmitCard,
}) => {
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
};
