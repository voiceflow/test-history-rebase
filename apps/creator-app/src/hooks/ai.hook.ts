import { DEFAULT_AI_MODEL, DEFAULT_AI_MODEL_PAID_PLAN } from '@voiceflow/dtos';

import { Workspace } from '@/ducks';

import { useSelector } from './store.hook';

export const useDefaultAIModel = () => {
  const isOnPaidPlan = useSelector(Workspace.active.isOnPaidPlanSelector);

  return isOnPaidPlan ? DEFAULT_AI_MODEL_PAID_PLAN : DEFAULT_AI_MODEL;
};
