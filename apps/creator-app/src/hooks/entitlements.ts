import type { Subscription } from '@voiceflow/dtos';
import { AIModel } from '@voiceflow/dtos';
import React from 'react';

import { AI_MODEL_CONFIG_MAP } from '@/config/ai-model';
import { Permission } from '@/constants/permissions';
import * as Organization from '@/ducks/organization';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { usePermission } from '@/hooks/permission';
import { useSelector } from '@/hooks/redux';

const ENTITLEMENTS_MODELS = new Set([
  AIModel.CLAUDE_INSTANT_V1,
  AIModel.CLAUDE_V1,
  AIModel.CLAUDE_V2,
  AIModel.CLAUDE_3_HAIKU,
  AIModel.CLAUDE_3_SONNET,
  AIModel.CLAUDE_3_OPUS,
  AIModel.GPT_3_5_TURBO,
  AIModel.GPT_3_5_TURBO_1106,
  AIModel.GPT_4,
  AIModel.GPT_4_TURBO,
]);

type EntitlementModels = typeof ENTITLEMENTS_MODELS extends Set<infer T> ? T : never;

const ENTITLEMENTS_BY_MODELS: Record<EntitlementModels, keyof Subscription['entitlements']> = {
  [AIModel.CLAUDE_INSTANT_V1]: 'claudeInstant',
  [AIModel.CLAUDE_V1]: 'claude1',
  [AIModel.CLAUDE_V2]: 'claude2',
  [AIModel.CLAUDE_3_HAIKU]: 'claude3Haiku',
  [AIModel.CLAUDE_3_SONNET]: 'claude3Sonnet',
  [AIModel.CLAUDE_3_OPUS]: 'claude3Opus',
  [AIModel.GPT_3_5_TURBO]: 'gpt',
  [AIModel.GPT_3_5_TURBO_1106]: 'gpt',
  [AIModel.GPT_4]: 'gpt4',
  [AIModel.GPT_4_TURBO]: 'gpt4Turbo',
};

const isEntitlementModel = (model: string): model is EntitlementModels =>
  ENTITLEMENTS_MODELS.has(model as EntitlementModels);

export const useAIModelEntitlement = () => {
  const isTrial = useSelector(WorkspaceV2.active.isOnTrialSelector);
  const isEnterprise = useSelector(WorkspaceV2.active.isEnterpriseSelector);
  const advancedLLMModelsPermission = usePermission(Permission.ADVANCED_LLM_MODELS);
  const subscription = useSelector(Organization.chargebeeSubscriptionSelector);

  const isReverseTrial = isTrial && !isEnterprise;

  // FIXME: remove FF https://voiceflow.atlassian.net/browse/CV3-994 - remove extra logic, and consider everyone has subscription
  const isAllowed = React.useCallback(
    (type: AIModel) => {
      if (subscription && isEntitlementModel(type)) {
        return subscription.entitlements[ENTITLEMENTS_BY_MODELS[type]];
      }

      if (!AI_MODEL_CONFIG_MAP[type].advanced) return true;

      return advancedLLMModelsPermission.allowed && !isReverseTrial;
    },
    [subscription?.id, isReverseTrial, advancedLLMModelsPermission.allowed]
  );

  return { isAllowed };
};
