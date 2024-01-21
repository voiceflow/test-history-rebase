import { AIModel } from '@voiceflow/dtos';

export const SYSTEM_PROMPT_AI_MODELS = new Set<AIModel>([
  AIModel.GPT_4,
  AIModel.CLAUDE_V1,
  AIModel.CLAUDE_V2,
  AIModel.GPT_4_TURBO,
  AIModel.GPT_3_5_TURBO,
  AIModel.CLAUDE_INSTANT_V1,
]);

export const ADVANCED_AI_MODELS = new Set<AIModel>([AIModel.GPT_4, AIModel.CLAUDE_V1, AIModel.CLAUDE_V2, AIModel.GPT_4_TURBO]);
