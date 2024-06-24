import { PlanName } from '@voiceflow/dtos';

import { UpgradePrompt } from '@/ducks/tracking/constants';

export interface PaymentModalProps {
  promptType?: UpgradePrompt;
  isTrialExpired?: boolean;
  nextPlan?: PlanName;
}
