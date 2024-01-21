import { AI_MODEL_MAX_TOKENS_DEFAULT, AI_MODEL_MAX_TOKENS_HEAVY, AIMessage, AIModel, AIParams, HEAVY_AI_MODELS } from '@voiceflow/dtos';

import { CompletionOptions, CompletionOutput } from './llm-model.dto';

export abstract class LLMModel {
  public abstract modelRef: AIModel;

  public readonly TIMEOUT: number;

  protected TOKEN_MULTIPLIER = 1;

  constructor(config: Record<string, unknown>) {
    if (typeof config.AI_GENERATION_TIMEOUT === 'number') {
      this.TIMEOUT = config.AI_GENERATION_TIMEOUT;
    } else {
      this.TIMEOUT = 45000;
    }
  }

  get tokenMultiplier() {
    return this.TOKEN_MULTIPLIER;
  }

  abstract generateCompletion(prompt: string, params: AIParams, options?: CompletionOptions): Promise<CompletionOutput>;

  abstract generateChatCompletion(messages: AIMessage[], params: AIParams, options?: CompletionOptions): Promise<CompletionOutput>;

  public normalizeMaxTokens(maxTokens: number | undefined) {
    if (!maxTokens) return maxTokens;

    const isHeavyModel = HEAVY_AI_MODELS.has(this.modelRef);

    return isHeavyModel ? Math.min(maxTokens, AI_MODEL_MAX_TOKENS_HEAVY) : Math.min(maxTokens, AI_MODEL_MAX_TOKENS_DEFAULT);
  }
}
