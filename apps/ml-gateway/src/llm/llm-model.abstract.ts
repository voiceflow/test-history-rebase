import { AI_MODEL_PARAMS, AIMessage, AIModel, AIParams, DEFAULT_AI_MODEL_PARAM } from '@voiceflow/dtos';

import { CompletionOptions, CompletionOutput } from './llm-model.dto';

export abstract class LLMModel {
  public abstract modelRef: AIModel;

  public readonly TIMEOUT: number;

  protected abstract TOKEN_MULTIPLIER: number;

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

  protected calculateTokenMultiplier(tokens: number): number {
    return Math.ceil(tokens * this.TOKEN_MULTIPLIER);
  }

  abstract generateCompletion(prompt: string, params: AIParams, options?: CompletionOptions): Promise<CompletionOutput>;

  abstract generateChatCompletion(messages: AIMessage[], params: AIParams, options?: CompletionOptions): Promise<CompletionOutput>;

  public normalizeMaxTokens(maxTokens: number | undefined) {
    if (!maxTokens) return maxTokens;

    return Math.min(maxTokens, AI_MODEL_PARAMS[this.modelRef].maxTokens ?? DEFAULT_AI_MODEL_PARAM.maxTokens);
  }
}
