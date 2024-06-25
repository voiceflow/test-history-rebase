import type { BillingPeriod } from '@voiceflow/internal';
import type { useSmartReducerV2 } from '@voiceflow/ui';

import type * as Tracking from '@/ducks/tracking';
import type { VoidInternalProps } from '@/ModalsV2/types';

import type { Step } from './constants';

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
