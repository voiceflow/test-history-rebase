import * as Realtime from '@voiceflow/realtime-sdk';

import { useFeature } from '@/hooks/feature';

interface GPTFeature {
  enabled: boolean;
  hitCap: boolean;
}

const useGPTSettingToggle = () => {
  // TODO Fetch GPT toggle info from workspace and project ducks
  return {
    workspaceEnabled: true,
    projectEnabled: true,
  };
};

const useGPTLimit = (): { hitCap: boolean } => {
  // TODO Fetch limit data from worksapce duck
  return { hitCap: false };
};

type GPTFeatureFlags =
  | Realtime.FeatureFlag.GPT_RESPONSE_GEN
  | Realtime.FeatureFlag.GPT_UTTERANCE_GEN
  | Realtime.FeatureFlag.GPT_ENTITY_VALUE_GEN
  | Realtime.FeatureFlag.GPT_ENTITY_REPROMPT_GEN
  | Realtime.FeatureFlag.GPT_NOMATCH_NOREPLY_GEN;

const useGPTFeature = (feature: GPTFeatureFlags) => {
  const gptFeature = useFeature(feature);
  const gptFeatures = useFeature(Realtime.FeatureFlag.ASSISTANT_AI);
  const gptSetting = useGPTSettingToggle();
  const gptLimit = useGPTLimit();

  const featureEnabled = gptFeatures.isEnabled && gptFeature.isEnabled && gptSetting.workspaceEnabled && gptSetting.projectEnabled;

  return {
    enabled: featureEnabled,
    hitCap: gptLimit.hitCap,
  };
};

export const useResponseGen = (): GPTFeature => useGPTFeature(Realtime.FeatureFlag.GPT_RESPONSE_GEN);
export const useUtteranceGen = (): GPTFeature => useGPTFeature(Realtime.FeatureFlag.GPT_UTTERANCE_GEN);
export const useEntityValueGen = (): GPTFeature => useGPTFeature(Realtime.FeatureFlag.GPT_ENTITY_VALUE_GEN);
export const useEntityRepromptGen = (): GPTFeature => useGPTFeature(Realtime.FeatureFlag.GPT_ENTITY_REPROMPT_GEN);
export const useNoMatchNoReplyGen = (): GPTFeature => useGPTFeature(Realtime.FeatureFlag.GPT_NOMATCH_NOREPLY_GEN);
