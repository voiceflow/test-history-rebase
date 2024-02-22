import { BillingPeriod } from '@voiceflow/internal';
import { useSmartReducerV2 } from '@voiceflow/ui';

import * as Tracking from '@/ducks/tracking';
import { VoidInternalProps } from '@/ModalsV2/types';

import { Step } from './Payment.constants';

export interface PaymentModalState {
  step: Step;
  period: BillingPeriod;
  editorSeats: number;
  viewerSeats: number;
}

export type PaymentModalStateAPI = ReturnType<typeof useSmartReducerV2<PaymentModalState>>[1];

export type ProPrices = Record<BillingPeriod, number> | null;

export interface PaymentModalAPIProps
  extends VoidInternalProps<{
    promptType?: Tracking.UpgradePrompt;
    isTrialExpired?: boolean;
  }> {}
