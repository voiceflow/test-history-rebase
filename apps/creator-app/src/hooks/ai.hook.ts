import { DEFAULT_AI_MODEL, DEFAULT_AI_MODEL_PAID_PLAN } from '@voiceflow/dtos';

import { useAIModelEntitlement } from './entitlements';

export const useDefaultAIModel = () => {
  const aiModelEntitlement = useAIModelEntitlement();

  return aiModelEntitlement.isAllowed(DEFAULT_AI_MODEL_PAID_PLAN) ? DEFAULT_AI_MODEL_PAID_PLAN : DEFAULT_AI_MODEL;
};
