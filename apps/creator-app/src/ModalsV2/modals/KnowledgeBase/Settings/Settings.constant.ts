import { BaseUtils } from '@voiceflow/base-types';
import { PlanType } from '@voiceflow/internal';

import { CLOUD_ENV, PRIVATE_LLM_MODELS } from '@/config';
import * as Tracking from '@/ducks/tracking';
import { getUpgradePopperProps } from '@/utils/upgrade';

export const MODEL_LABELS = {
  [BaseUtils.ai.GPT_MODEL.DaVinci_003]: { name: 'GPT-3 DaVinci', info: '1x Tokens', icon: 'OpenAi' },
  [BaseUtils.ai.GPT_MODEL.GPT_3_5_turbo]: { name: 'GPT-3.5 Turbo (ChatGPT)', info: '1x Tokens', icon: 'OpenAi' },
  [BaseUtils.ai.GPT_MODEL.CLAUDE_INSTANT_V1]: { name: 'Claude Instant 1.2', info: '1x Tokens', icon: 'Anthropic' },
  [BaseUtils.ai.GPT_MODEL.CLAUDE_V1]: { name: 'Claude 1', info: '10x Tokens', icon: 'Anthropic' },
  [BaseUtils.ai.GPT_MODEL.CLAUDE_V2]: { name: 'Claude 2', info: '10x Tokens', icon: 'Anthropic' },
  [BaseUtils.ai.GPT_MODEL.GPT_4]: { name: 'GPT-4', info: '25x Tokens', icon: 'OpenAi' },
};

// add label prefix
Object.values(MODEL_LABELS).forEach((model) => {
  if (PRIVATE_LLM_MODELS) model.name = `${CLOUD_ENV.toUpperCase()} ${model.name}`;
});

export const SYSTEM_PROMPT_MODELS = new Set([
  BaseUtils.ai.GPT_MODEL.CLAUDE_INSTANT_V1,
  BaseUtils.ai.GPT_MODEL.CLAUDE_V1,
  BaseUtils.ai.GPT_MODEL.CLAUDE_V2,
  BaseUtils.ai.GPT_MODEL.GPT_3_5_turbo,
  BaseUtils.ai.GPT_MODEL.GPT_4,
]);

export const ADVANCED_LLM_MODELS = new Set([BaseUtils.ai.GPT_MODEL.GPT_4, BaseUtils.ai.GPT_MODEL.CLAUDE_V1, BaseUtils.ai.GPT_MODEL.CLAUDE_V2]);

export const SYSTEM_PLACEHOLDERS = ['You are a helpful assistant', 'You are a spanish tutor', 'You are a travel agent'];

export const getUpgradeModelConfig = ({ model }: { model: BaseUtils.ai.GPT_MODEL }) => ({
  ...getUpgradePopperProps(PlanType.TEAM, Tracking.UpgradePrompt.KB_MODELS),
  title: 'Upgrade to Team',
  header: 'Need more AI models?',
  description: `${MODEL_LABELS[model].name} is a team feature. Please upgrade to team to continue.`,
});
