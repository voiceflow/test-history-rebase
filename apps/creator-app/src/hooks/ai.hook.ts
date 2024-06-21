import { DEFAULT_AI_MODEL, DEFAULT_AI_MODEL_PAID_PLAN } from '@voiceflow/dtos';
import { FeatureFlag } from '@voiceflow/realtime-sdk';

import { useAIModelEntitlement } from './entitlements.hook';
import { useFeature } from './feature';

export const useIsAIFeaturesEnabled = () => {
  const assistantAI = useFeature(FeatureFlag.ASSISTANT_AI);

  return assistantAI.isEnabled;
};

export const useDefaultAIModel = () => {
  const aiModelEntitlement = useAIModelEntitlement();

  return aiModelEntitlement.isAllowed(DEFAULT_AI_MODEL_PAID_PLAN) ? DEFAULT_AI_MODEL_PAID_PLAN : DEFAULT_AI_MODEL;
};
