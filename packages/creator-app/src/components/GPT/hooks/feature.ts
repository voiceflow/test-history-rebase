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
  const workspace = useActiveWorkspace();

  const quotaData = React.useMemo(() => workspace?.quotas?.find((quota: any) => quota.quotaDetails.name === QuotaNames.TOKENS), [workspace?.quotas]);

  return {
    quota: quotaData?.quota ?? 0,
    consumed: quotaData?.consumed ?? 0,
  };
};

export const useGPTSettingsToggles = (): { workspace: boolean; project: Record<string, boolean> } => {
  const workspace = useActiveWorkspace();
  const projectAiAssistSettings = useSelector(ProjectV2.active.aiAssistSettings);

  return {
    workspace: workspace?.settings?.aiAssist ?? false,
    project: {
      generative: projectAiAssistSettings?.generativeTasks ?? false,
    },
  };
};

const useGPTFeature = () => {
  const gptFeatures = useFeature(Realtime.FeatureFlag.ASSISTANT_AI);
  const workspace = useActiveWorkspace();
  const gptSetting = useGPTSettingsToggles();

  const quota = workspace?.quotas?.find((q) => q.quotaDetails.name === Realtime.QuotaNames.TOKENS);
  const hitCap = quota ? quota.consumed >= quota.quota : false;
  const featureEnabled = gptFeatures.isEnabled && gptSetting.workspace;

  return {
    isEnabled: featureEnabled,
    hitCap,
  };
};

export const useGPTGenFeatures = () => {
  const { isEnabled, hitCap } = useGPTFeature();
  const gptSetting = useGPTSettingsToggles();

  const featureEnabled = isEnabled && gptSetting.project.generative;

  return {
    isEnabled: featureEnabled,
    hitCap,
  };
};

// FREESTYLE
export const useFreestyleFeature = (): GPTFeature => {
  const { isEnabled, hitCap } = useGPTFeature();
  const freestyleFeatureFlag = useFeature(Realtime.FeatureFlag.GPT_FREESTYLE);

  return {
    isEnabled: isEnabled && freestyleFeatureFlag.isEnabled,
    hitCap,
  };
};
