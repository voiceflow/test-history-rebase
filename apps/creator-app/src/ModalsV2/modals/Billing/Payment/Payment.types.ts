import type { UpgradePrompt } from '@/ducks/tracking/constants';
import type { VoidInternalProps } from '@/ModalsV2/types';

export interface PaymentModalProps {
  promptType?: UpgradePrompt;
  isTrialExpired?: boolean;
}

export type PaymentModalPropsAPI = VoidInternalProps<PaymentModalProps>;
