import { AIGPTModel, AIMessage, AIParams } from '@voiceflow/dtos';

import { CompletionOptions, CompletionOutput } from './llm-model.dto';

export abstract class LLMModel {
  public abstract modelRef: AIGPTModel;

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
}
