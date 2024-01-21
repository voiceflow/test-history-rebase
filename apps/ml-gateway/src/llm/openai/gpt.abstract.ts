import { Logger } from '@nestjs/common';
import { AIMessage, AIMessageRole, AIParams } from '@voiceflow/dtos';
import { ChatCompletionRequestMessageRoleEnum, CreateChatCompletionResponse } from '@voiceflow/openai';

import { LLMModel } from '../llm-model.abstract';
import { EmptyCompletionOutput } from '../llm-model.constant';
import type { CompletionOptions, CompletionOutput } from '../llm-model.dto';
import { AzureConfig, OpenAIConfig } from './gpt.interface';
import { delayedPromiseRace, getOpenAIResponseError, isAxiosError } from './gpt.util';
import { OpenAIClient } from './openai-api.client';

export abstract class GPTLLMModel extends LLMModel {
  protected logger = new Logger(GPTLLMModel.name);

  protected abstract openaiModelName: string;

  protected readonly client: OpenAIClient;

  static RoleMapping = {
    [AIMessageRole.ASSISTANT]: ChatCompletionRequestMessageRoleEnum.Assistant,
    [AIMessageRole.SYSTEM]: ChatCompletionRequestMessageRoleEnum.System,
    [AIMessageRole.USER]: ChatCompletionRequestMessageRoleEnum.User,
  };

  // try using azure openai first, if it fails, defer to openai api
  constructor(protected config: OpenAIConfig, protected azureConfig?: AzureConfig) {
    super(config);

    this.client = new OpenAIClient(config, this.azureConfig?.deployment);
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
    client = this.client.client,
    model = this.openaiModelName
  ): Promise<CompletionOutput> {
    if (!client) {
      const error = `Cant use ${this.modelRef} completion as no valid openAI configuration is set`;
      this.logger.warn(error);
      return EmptyCompletionOutput({ error, model });
    }

    if (params.system) messages.unshift({ role: AIMessageRole.SYSTEM, content: params.system });

    const result = await client.createChatCompletion(
      {
        model,
        stop: params.stop,
        max_tokens: this.normalizeMaxTokens(params.maxTokens),
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

  private async generateAzureChatCompletion(messages: AIMessage[], params: AIParams, options?: CompletionOptions): Promise<CompletionOutput> {
    try {
      const resolveCompletion = () => this.callChatCompletion(messages, params, options, this.client.azureClient, this.azureConfig!.model);

      if (this.azureConfig?.race) {
        // with azure, sometimes it times out randomly, so we need to retry
        return await delayedPromiseRace(resolveCompletion, options?.retryDelay ?? 5000, options?.retries ?? 1);
      }

      return await resolveCompletion();
    } catch (error: any) {
      // intercept error and retry with OpenAI API if we fail on the azure instance due to rate limiting
      if (isAxiosError(error) && error.response?.status === 429 && this.client.openAIClient) {
        this.logger.warn({ error, messages, params }, `${this.modelRef} Azure completion`);
        return this.generateOpenAIChatCompletion(messages, params, options);
      }

      throw error;
    }
  }

  private async generateOpenAIChatCompletion(messages: AIMessage[], params: AIParams, options?: CompletionOptions): Promise<CompletionOutput> {
    return this.callChatCompletion(messages, params, options, this.client.openAIClient);
  }

  protected routeChatCompletion(messages: AIMessage[], params: AIParams, options?: CompletionOptions): Promise<CompletionOutput> {
    if (this.azureConfig && this.client.azureClient) return this.generateAzureChatCompletion(messages, params, options);

    return this.generateOpenAIChatCompletion(messages, params, options);
  }

  async generateChatCompletion(messages: AIMessage[], params: AIParams, options?: CompletionOptions): Promise<CompletionOutput> {
    try {
      return await this.routeChatCompletion(messages, params, options);
    } catch (error: any) {
      this.logger.warn({ error: getOpenAIResponseError(error) ?? error, messages, params }, `${this.modelRef} completion`);
      return EmptyCompletionOutput({ error: getOpenAIResponseError(error), model: this.modelRef });
    }
  }
}
