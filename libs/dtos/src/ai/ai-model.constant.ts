import { AIModel } from './ai-model.enum';

// AIModelParams are meant to be shared by both creator-app and ml-gateway
export interface AIModelParam {
  maxTokens: number;
  hasSystemPrompt: boolean;
}

export const DEFAULT_AI_MODEL_PARAM = {
  maxTokens: 2000,
  hasSystemPrompt: true,
};

// the typing forces us to always have a param for each model
export const AI_MODEL_PARAMS: Record<AIModel, AIModelParam> = {
  // Google
  [AIModel.GEMINI_PRO]: DEFAULT_AI_MODEL_PARAM,

  // OpenAI
  [AIModel.DaVinci_003]: {
    ...DEFAULT_AI_MODEL_PARAM,
    hasSystemPrompt: false,
  },
  [AIModel.GPT_3_5_TURBO]: DEFAULT_AI_MODEL_PARAM,
  [AIModel.GPT_3_5_TURBO_1106]: DEFAULT_AI_MODEL_PARAM,
  [AIModel.GPT_4]: {
    ...DEFAULT_AI_MODEL_PARAM,
    maxTokens: 500,
  },
  [AIModel.GPT_4_TURBO]: {
    ...DEFAULT_AI_MODEL_PARAM,
    maxTokens: 500,
  },

  // Anthropic
  [AIModel.CLAUDE_INSTANT_V1]: {
    ...DEFAULT_AI_MODEL_PARAM,
    hasSystemPrompt: false,
  },
  [AIModel.CLAUDE_V1]: {
    ...DEFAULT_AI_MODEL_PARAM,
    hasSystemPrompt: false,
  },
  [AIModel.CLAUDE_V2]: {
    ...DEFAULT_AI_MODEL_PARAM,
    hasSystemPrompt: false,
  },
  [AIModel.CLAUDE_3_HAIKU]: DEFAULT_AI_MODEL_PARAM,
  [AIModel.CLAUDE_3_SONNET]: DEFAULT_AI_MODEL_PARAM,
  [AIModel.CLAUDE_3_OPUS]: {
    ...DEFAULT_AI_MODEL_PARAM,
    maxTokens: 500,
  },
};
