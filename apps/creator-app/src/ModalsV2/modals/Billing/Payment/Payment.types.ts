import { UpgradePrompt } from '@/ducks/tracking/constants';
import { VoidInternalProps } from '@/ModalsV2/types';

export interface PaymentModalProps {
  promptType?: UpgradePrompt;
  isTrialExpired?: boolean;
}

export type PaymentModalPropsAPI = VoidInternalProps<PaymentModalProps>;
