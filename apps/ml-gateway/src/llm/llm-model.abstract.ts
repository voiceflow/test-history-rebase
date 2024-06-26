import type { AIMessage, AIModel, AIParams } from '@voiceflow/dtos';
import { AI_MODEL_PARAMS, DEFAULT_AI_MODEL_PARAM } from '@voiceflow/dtos';
import type { Observable } from 'rxjs';

import type { CompletionOptions, CompletionOutput, CompletionStreamOutput } from './llm-model.dto';

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

  abstract generateCompletionStream(
    prompt: string,
    params: AIParams,
    options?: CompletionOptions
  ): Observable<CompletionStreamOutput>;

  abstract generateChatCompletion(
    messages: AIMessage[],
    params: AIParams,
    options?: CompletionOptions
  ): Promise<CompletionOutput>;

  abstract generateChatCompletionStream(
    messages: AIMessage[],
    params: AIParams,
    options?: CompletionOptions
  ): Observable<CompletionStreamOutput>;

  public normalizeMaxTokens(maxTokens: number | undefined) {
    if (!maxTokens) return maxTokens;

    return Math.min(maxTokens, AI_MODEL_PARAMS[this.modelRef].maxTokens ?? DEFAULT_AI_MODEL_PARAM.maxTokens);
  }
}
