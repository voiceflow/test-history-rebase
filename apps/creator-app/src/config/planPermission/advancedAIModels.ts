import { AIModel } from '@voiceflow/dtos';
import { PlanType } from '@voiceflow/internal';

import { ADVANCED_AI_MODELS, AI_MODEL_CONFIG_MAP } from '@/config/ai-model';
import { Permission } from '@/constants/permissions';
import { PRO_PLUS_PLANS } from '@/constants/plans';
import * as Tracking from '@/ducks/tracking';
import { getUpgradeModalProps } from '@/utils/upgrade';

import { UpgradeModalPlanPermission } from './types';

export interface Data {
  modelType: AIModel;
}

export interface CanvasPaidStepsPermission extends UpgradeModalPlanPermission<Data> {
  isAdvancedAIModel: (modelType: AIModel) => boolean;
}

export const getAdvancedAiModelUpgradeModal = (modelType: AIModel) => ({
  ...getUpgradeModalProps(PlanType.PRO, Tracking.UpgradePrompt.KB_MODELS),
  title: 'Upgrade to Pro',
  header: 'Need more AI models?',
  description: `${AI_MODEL_CONFIG_MAP[modelType].name} is a paid feature. Please upgrade to pro to continue.`,
});

export const ADVANCED_AI_MODELS_PERMISSIONS = {
  plans: PRO_PLUS_PLANS,
  permission: Permission.ADVANCED_LLM_MODELS,

  isAdvancedAIModel: (modelType: AIModel) => ADVANCED_AI_MODELS.has(modelType),

  upgradeModal: ({ modelType }) => getAdvancedAiModelUpgradeModal(modelType),
} satisfies CanvasPaidStepsPermission;
