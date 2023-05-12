import * as Realtime from '@voiceflow/realtime-sdk';
import { QuotaNames } from '@voiceflow/realtime-sdk';
import React from 'react';

import * as ProjectV2 from '@/ducks/projectV2';
import { useFeature } from '@/hooks/feature';
import { useSelector } from '@/hooks/redux';
import { useActiveWorkspace } from '@/hooks/workspace';

export const useGPTQuotas = () => {
  const workspace = useActiveWorkspace();

  const quotaData = React.useMemo(() => workspace?.quotas?.find((quota: any) => quota.quotaDetails.name === QuotaNames.TOKENS), [workspace?.quotas]);

  return {
    quota: quotaData?.quota ?? 0,
    consumed: quotaData?.consumed ?? 0,
  };
};

export const useWorkspaceAIAssist = (): boolean => {
  return useActiveWorkspace()?.settings?.aiAssist ?? false;
};

export const useProjectAIPlayground = (): boolean => {
  const workspaceAIAssist = useWorkspaceAIAssist();
  const projectAIPlayground = useSelector(ProjectV2.active.aiAssistSettings)?.aiPlayground ?? false;

  return workspaceAIAssist && projectAIPlayground;
};

export const useKnowledgeBase = (): boolean => {
  const aiPlayground = useProjectAIPlayground();
  const knowledgeBase = useFeature(Realtime.FeatureFlag.KNOWLEDGE_BASE);
  const platform = useSelector(ProjectV2.active.platformSelector);

  return (
    aiPlayground &&
    knowledgeBase.isEnabled &&
    !Realtime.Utils.typeGuards.isGooglePlatform(platform) &&
    !Realtime.Utils.typeGuards.isAlexaPlatform(platform)
  );
};

export const useGPTGenFeatures = () => {
  const gptFeatures = useFeature(Realtime.FeatureFlag.ASSISTANT_AI);
  const workspace = useActiveWorkspace();
  const workspaceAIAssist = useWorkspaceAIAssist();

  const quota = workspace?.quotas?.find((q) => q.quotaDetails.name === Realtime.QuotaNames.TOKENS);
  const hitCap = quota ? quota.consumed >= quota.quota : false;
  const featureEnabled = gptFeatures.isEnabled && workspaceAIAssist;

  return {
    isEnabled: featureEnabled,
    hitCap,
  };
};
