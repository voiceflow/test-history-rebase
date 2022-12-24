import * as Realtime from '@voiceflow/realtime-sdk';
import { QuotaNames } from '@voiceflow/realtime-sdk';
import React from 'react';

import * as ProjectV2 from '@/ducks/projectV2';
import { useActiveWorkspace, useFeature, useSelector } from '@/hooks';

interface GPTFeature {
  isEnabled: boolean;
  hitCap: boolean;
}

export const useGPTQuotas = () => {
  const workspace = useActiveWorkspace()!;

  const quotaData = React.useMemo(
    () => workspace.quotas?.find((quota: any) => quota.quotaDetails.name === QuotaNames.TOKENS) || { consumed: 0, quota: 0 },
    [workspace.quotas]
  );

  return {
    quota: quotaData.quota,
    consumed: quotaData.consumed,
  };
};

export const useGPTSettingsToggles = (): { workspace: boolean; project: Record<string, boolean> } => {
  const workspace = useActiveWorkspace()!;
  const projectAiAssistSettings = useSelector(ProjectV2.active.aiAssistSettings);

  return {
    workspace: workspace.settings?.aiAssist ?? false,
    project: {
      generative: projectAiAssistSettings?.generativeTasks ?? false,
    },
  };
};

type GPTFeatureFlags =
  | Realtime.FeatureFlag.GPT_RESPONSE_GEN
  | Realtime.FeatureFlag.GPT_UTTERANCE_GEN
  | Realtime.FeatureFlag.GPT_ENTITY_VALUE_GEN
  | Realtime.FeatureFlag.GPT_ENTITY_REPROMPT_GEN
  | Realtime.FeatureFlag.GPT_FREESTYLE
  | Realtime.FeatureFlag.GPT_NOMATCH_NOREPLY_GEN;

const useGPTFeature = (feature: GPTFeatureFlags) => {
  const gptFeature = useFeature(feature);
  const gptFeatures = useFeature(Realtime.FeatureFlag.ASSISTANT_AI);
  const workspace = useActiveWorkspace()!;
  const gptSetting = useGPTSettingsToggles();

  const quota = workspace.quotas?.find((q) => q.quotaDetails.name === Realtime.QuotaNames.TOKENS);
  const hitCap = quota ? quota.consumed >= quota.quota : false;
  const featureEnabled = gptFeatures.isEnabled && gptFeature.isEnabled && gptSetting.workspace && gptSetting.project.generative;

  return {
    isEnabled: featureEnabled,
    hitCap,
  };
};

export const useResponseGenFeature = (): GPTFeature => useGPTFeature(Realtime.FeatureFlag.GPT_RESPONSE_GEN);
export const useUtteranceGenFeature = (): GPTFeature => useGPTFeature(Realtime.FeatureFlag.GPT_UTTERANCE_GEN);
export const useEntityValueGenFeature = (): GPTFeature => useGPTFeature(Realtime.FeatureFlag.GPT_ENTITY_VALUE_GEN);
export const useEntityRepromptGenFeature = (): GPTFeature => useGPTFeature(Realtime.FeatureFlag.GPT_ENTITY_REPROMPT_GEN);
export const useNoMatchNoReplyGenFeature = (): GPTFeature => useGPTFeature(Realtime.FeatureFlag.GPT_NOMATCH_NOREPLY_GEN);
export const useFreestyleFeature = (): GPTFeature => useGPTFeature(Realtime.FeatureFlag.GPT_FREESTYLE);
