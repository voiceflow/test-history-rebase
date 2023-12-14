import { AIGPTModel } from '@voiceflow/dtos';
import type { IconName } from '@voiceflow/icons';
import { PlanType } from '@voiceflow/internal';

import { CLOUD_ENV, PRIVATE_LLM_MODELS } from '@/config';
import * as Tracking from '@/ducks/tracking';
import { getUpgradePopperProps } from '@/utils/upgrade';

export const MODEL_LABELS: Record<string, { name: string; info: string; deprecated?: boolean; disabled?: boolean; icon: IconName }> = {
  [AIGPTModel.DaVinci_003]: { name: 'GPT-3 DaVinci', info: '1x Tokens', icon: 'OpenAi', deprecated: true },
  [AIGPTModel.GPT_3_5_turbo]: { name: 'GPT-3.5 Turbo (ChatGPT)', info: '0.75x Tokens', icon: 'OpenAi' },
  [AIGPTModel.CLAUDE_INSTANT_V1]: { name: 'Claude Instant 1.2', info: '1x Tokens', icon: 'Anthropic' },
  [AIGPTModel.CLAUDE_V1]: { name: 'Claude 1', info: '10x Tokens', icon: 'Anthropic' },
  [AIGPTModel.CLAUDE_V2]: { name: 'Claude 2', info: '10x Tokens', icon: 'Anthropic' },
  [AIGPTModel.GPT_4]: { name: 'GPT-4', info: '25x Tokens', icon: 'OpenAi' },
  [AIGPTModel.GPT_4_TURBO]: { name: 'GPT-4 Turbo', info: '12x Tokens', icon: 'OpenAi' },
  [AIGPTModel.GEMINI_PRO]: { name: 'Gemini Pro (coming soon)', info: '', icon: 'Anthropic', disabled: true },
};

// add label prefix
Object.values(MODEL_LABELS).forEach((model) => {
  if (PRIVATE_LLM_MODELS) model.name = `${CLOUD_ENV.toUpperCase()} ${model.name}`;
});

export const SYSTEM_PROMPT_MODELS = new Set<AIGPTModel>([
  AIGPTModel.CLAUDE_INSTANT_V1,
  AIGPTModel.CLAUDE_V1,
  AIGPTModel.CLAUDE_V2,
  AIGPTModel.GPT_3_5_turbo,
  AIGPTModel.GPT_4,
  AIGPTModel.GPT_4_TURBO,
]);

export const ADVANCED_LLM_MODELS = new Set<AIGPTModel>([AIGPTModel.GPT_4, AIGPTModel.CLAUDE_V1, AIGPTModel.CLAUDE_V2, AIGPTModel.GPT_4_TURBO]);

export const SYSTEM_PLACEHOLDERS = ['You are a helpful assistant', 'You are a spanish tutor', 'You are a travel agent'];

export const getUpgradeModelConfig = ({ model }: { model: AIGPTModel }) => ({
  ...getUpgradePopperProps(PlanType.TEAM, Tracking.UpgradePrompt.KB_MODELS),
  title: 'Upgrade to Team',
  header: 'Need more AI models?',
  description: `${MODEL_LABELS[model].name} is a team feature. Please upgrade to team to continue.`,
});
