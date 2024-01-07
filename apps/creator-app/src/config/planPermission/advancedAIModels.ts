import { AIGPTModel } from '@voiceflow/dtos';
import { PlanType } from '@voiceflow/internal';

import { ADVANCED_AI_MODELS, AI_MODEL_CONFIG_MAP } from '@/config/ai-model';
import { Permission } from '@/constants/permissions';
import { TEAM_PLUS_PLANS } from '@/constants/plans';
import * as Tracking from '@/ducks/tracking';
import { getUpgradeModalProps } from '@/utils/upgrade';

import { UpgradeModalPlanPermission } from './types';

export interface Data {
  modelType: AIGPTModel;
}

export interface CanvasPaidStepsPermission extends UpgradeModalPlanPermission<Data> {
  isAdvancedAIModel: (modelType: AIGPTModel) => boolean;
}

export const getAdvancedAiModelUpgradeModal = (modelType: AIGPTModel) => ({
  ...getUpgradeModalProps(PlanType.TEAM, Tracking.UpgradePrompt.KB_MODELS),
  title: 'Upgrade to Pro',
  header: 'Need more AI models?',
  description: `${AI_MODEL_CONFIG_MAP[modelType].name} is a paid feature. Please upgrade to pro to continue.`,
});

export const ADVANCED_AI_MODELS_PERMISSIONS = {
  plans: TEAM_PLUS_PLANS,
  permission: Permission.ADVANCED_LLM_MODELS,

  isAdvancedAIModel: (modelType: AIGPTModel) => ADVANCED_AI_MODELS.has(modelType),

  upgradeModal: ({ modelType }) => getAdvancedAiModelUpgradeModal(modelType),
} satisfies CanvasPaidStepsPermission;
