import { Logger } from '@nestjs/common';
import { AIGPTModel, AIMessage, AIParams } from '@voiceflow/dtos';

import { EmptyCompletionOutput } from '../llm-model.constant';
import type { CompletionOptions } from '../llm-model.dto';
import { GPTLLMModel } from './gpt.abstract';
import { OpenAIConfig } from './gpt.interface';
import { getOpenAIResponseError, isAxiosError } from './gpt.util';
import { GPT3_5_1106 } from './gpt3-5-1106.client';

export class GPT3_5 extends GPTLLMModel {
  protected logger = new Logger(GPT3_5.name);

  TOKEN_MULTIPLIER = 0.75;

  public modelRef = AIGPTModel.GPT_3_5_TURBO;

  protected openaiModelName = 'gpt-3.5-turbo-0613';

  constructor(config: OpenAIConfig) {
    // this is gpt-3.5-turbo-0613
    const azureConfig = {
      model: 'gpt-3.5-turbo',
      deployment: 'vf-gpt35-turbo',
      race: true,
    };

    super(config, azureConfig);
  }

  async generateChatCompletion(messages: AIMessage[], params: AIParams, options?: CompletionOptions) {
    try {
      return await this.routeChatCompletion(messages, params, options);
    } catch (error: any) {
      // intercept context_length_exceeded error and retry with gpt-3.5-turbo-1106
      if (isAxiosError(error) && error?.response?.data?.error?.code === 'context_length_exceeded') {
        return new GPT3_5_1106(this.config).generateChatCompletion(messages, params, options);
      }

      this.logger.warn({ error, messages, params }, `${this.modelRef} completion`);
      return EmptyCompletionOutput({ error: getOpenAIResponseError(error), model: this.modelRef });
    }
  }
}
