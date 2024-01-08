import { Logger } from '@nestjs/common';
import { AIMessage, AIMessageRole, AIParams } from '@voiceflow/dtos';
import { ChatCompletionRequestMessageRoleEnum, CreateChatCompletionResponse } from '@voiceflow/openai';

import { LLMModel } from '../llm-model.abstract';
import type { CompletionOptions, CompletionOutput } from '../llm-model.dto';
import { OpenAIConfig } from './gpt.interface';
import { delayedPromiseRace } from './gpt.util';
import { OpenAIClient } from './openai-api.client';

export abstract class GPTLLMModel extends LLMModel {
  protected logger = new Logger(GPTLLMModel.name);

  // try using azure openai first, if it fails, defer to openai api
  protected useAzureOpenAI = false;

  protected abstract gptModelName: string;

  protected readonly client: OpenAIClient;

  static RoleMapping = {
    [AIMessageRole.ASSISTANT]: ChatCompletionRequestMessageRoleEnum.Assistant,
    [AIMessageRole.SYSTEM]: ChatCompletionRequestMessageRoleEnum.System,
    [AIMessageRole.USER]: ChatCompletionRequestMessageRoleEnum.User,
  };

  constructor(config: OpenAIConfig) {
    super(config);

    this.client = new OpenAIClient(config);
  }

  private calculateTokenMultiplier(tokens: number): number {
    return Math.ceil(tokens * this.TOKEN_MULTIPLIER);
  }

  protected generateOutput(result?: CreateChatCompletionResponse | null): CompletionOutput {
    const output = result?.choices[0].message?.content ?? null;
    const tokens = result?.usage?.total_tokens ?? 0;
    const queryTokens = result?.usage?.prompt_tokens ?? 0;
    const answerTokens = result?.usage?.completion_tokens ?? 0;

    return {
      output,
      tokens: this.calculateTokenMultiplier(tokens),
      queryTokens: this.calculateTokenMultiplier(queryTokens),
      answerTokens: this.calculateTokenMultiplier(answerTokens),
      multiplier: this.TOKEN_MULTIPLIER,
      model: this.modelRef,
    };
  }

  private async callChatCompletion(
    messages: AIMessage[],
    params: AIParams,
    options?: CompletionOptions,
    client = this.client.client
  ): Promise<CompletionOutput | null> {
    if (!client) {
      this.logger.warn(`Cant use ${this.modelRef} completion as no valid openAI configuration is set`);
      return null;
    }

    if (params.system) messages.unshift({ role: AIMessageRole.SYSTEM, content: params.system });

    const result = await client.createChatCompletion(
      {
        model: this.gptModelName,
        stop: params.stop,
        max_tokens: params.maxTokens,
        temperature: params.temperature,
        messages: messages.map(({ role, content }) => ({ role: GPTLLMModel.RoleMapping[role], content })),
      },
      { timeout: options?.timeout ?? this.TIMEOUT }
    );

    return this.generateOutput(result?.data);
  }

  async generateCompletion(prompt: string, params: AIParams, options?: CompletionOptions & { shouldThrow?: boolean }) {
    const messages: AIMessage[] = [{ role: AIMessageRole.USER, content: prompt }];

    return this.generateChatCompletion(messages, params, options);
  }

  async generateAzureChatCompletion(messages: AIMessage[], params: AIParams, options?: CompletionOptions): Promise<CompletionOutput | null> {
    try {
      // with azure, sometimes it times out, so we need to retry
      const resolveCompletion = () => this.callChatCompletion(messages, params, options, this.client.azureClient);
      return delayedPromiseRace(resolveCompletion, options?.retryDelay ?? 5000, options?.retries ?? 1);
    } catch (error: any) {
      this.logger.warn({ error, messages, params, data: error?.response?.data?.error }, `${this.modelRef} completion`);

      // if we fail on the azure instance due to rate limiting, retry with OpenAI API
      if (error?.response?.status === 429 && this.client.openAIClient) {
        return this.generateOpenAIChatCompletion(messages, params, options);
      }

      return null;
    }
  }

  async generateOpenAIChatCompletion(messages: AIMessage[], params: AIParams, options?: CompletionOptions): Promise<CompletionOutput | null> {
    return this.callChatCompletion(messages, params, options, this.client.openAIClient).catch((error) => {
      this.logger.warn({ error, messages, params, data: error?.response?.data?.error }, `${this.modelRef} completion`);
      return null;
    });
  }

  async generateChatCompletion(messages: AIMessage[], params: AIParams, options?: CompletionOptions): Promise<CompletionOutput | null> {
    if (this.useAzureOpenAI && this.client.azureClient) return this.generateAzureChatCompletion(messages, params, options);

    return this.generateOpenAIChatCompletion(messages, params, options);
  }
}
