import { AIModel } from './ai-model.enum';

export const AI_MODEL_MAX_TOKENS_HEAVY = 500;
export const AI_MODEL_MAX_TOKENS_DEFAULT = 2000;

export const HEAVY_AI_MODELS = new Set<AIModel>([AIModel.GPT_4, AIModel.GPT_4_TURBO]);
