import { Logger } from '@nestjs/common';
import type { AIMessage, AIModel, AIParams } from '@voiceflow/dtos';
import { AIMessageRole } from '@voiceflow/dtos';
import type { supportModelType as SupportModelType } from 'gpt-tokens';
import { GPTTokens } from 'gpt-tokens';
import type { ChatCompletion, ChatCompletionChunk } from 'openai/resources/chat';
import type { Observable } from 'rxjs';
import { from, map, mergeMap, of } from 'rxjs';
import { match } from 'ts-pattern';

import { LLMModel } from '../llm-model.abstract';
import { EmptyCompletionOutput } from '../llm-model.constant';
import type { CompletionOptions, CompletionOutput, CompletionStreamOutput } from '../llm-model.dto';
import type { AzureConfig, OpenAIConfig } from './gpt.interface';
import { delayedPromiseRace, emptyCompletionOutput, getOpenAIResponseError, isAxiosError } from './gpt.util';
import { OpenAIClient } from './openai-api.client';

export abstract class GPTLLMModel extends LLMModel {
  protected logger = new Logger(GPTLLMModel.name);

  protected abstract openaiModelName: string;

  protected readonly client: OpenAIClient;

  static RoleMapping = {
    [AIMessageRole.ASSISTANT]: 'assistant',
    [AIMessageRole.SYSTEM]: 'system',
    [AIMessageRole.USER]: 'user',
  } as const;

  // try using azure openai first, if it fails, defer to openai api
  constructor(
    protected config: OpenAIConfig,
    protected azureConfig?: AzureConfig
  ) {
    super(config);

    this.client = new OpenAIClient(config, this.azureConfig?.deployment);
  }

  protected generateOutput(result?: ChatCompletion | null): CompletionOutput {
    const output = result?.choices[0].message?.content ?? null;
    const queryTokens = this.calculateTokenMultiplier(result?.usage?.prompt_tokens ?? 0);
    const answerTokens = this.calculateTokenMultiplier(result?.usage?.completion_tokens ?? 0);
    const tokens = queryTokens + answerTokens;

    return {
      output,
      tokens,
      queryTokens,
      answerTokens,
      multiplier: this.TOKEN_MULTIPLIER,
      model: this.modelRef,
    };
  }

  protected generateChunkOutput(result: ChatCompletionChunk | null, includePromptTokens: boolean): CompletionOutput {
    const output = result?.choices?.[0]?.delta?.content ?? '';

    const usage = new GPTTokens({
      model: match<AIModel, SupportModelType>(this.modelRef)
        .with('text-davinci-003', () => 'gpt-3.5-turbo-0613')
        .with('gpt-4-turbo', () => 'gpt-4-turbo-preview')
        .otherwise((model) => model as SupportModelType),
      messages: [{ content: output, role: 'assistant' }],
    });

    const answerTokens = this.calculateTokenMultiplier(usage.completionUsedTokens);
    const queryTokens = includePromptTokens ? this.calculateTokenMultiplier(usage.promptUsedTokens) : 0;
    const tokens = answerTokens + queryTokens;

    return {
      output,
      tokens,
      queryTokens,
      answerTokens,
      multiplier: this.TOKEN_MULTIPLIER,
      model: this.modelRef,
    };
  }

  private callChatCompletionStream(
    messages: AIMessage[],
    params: AIParams,
    options?: CompletionOptions,
    client = this.client.client,
    model = this.openaiModelName
  ): Observable<CompletionStreamOutput> {
    if (!client) {
      const error = `Cant use ${this.modelRef} completion as no valid openAI configuration is set`;
      this.logger.warn(error);
      return of(emptyCompletionOutput(model, error));
    }

    if (params.system) messages.unshift({ role: AIMessageRole.SYSTEM, content: params.system });

    return from(
      client.chat.completions.create(
        {
          model,
          stop: params.stop,
          max_tokens: this.normalizeMaxTokens(params.maxTokens),
          temperature: params.temperature,
          messages: messages.map(({ role, content }) => ({ role: GPTLLMModel.RoleMapping[role], content })),
          stream: true,
        },
        { timeout: options?.timeout ?? this.TIMEOUT }
      )
    ).pipe(
      mergeMap((chunk) => chunk),
      map((chunk, i) => ({
        type: 'completion',
        completion: this.generateChunkOutput(chunk, i === 0),
      }))
    );
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

    const result = await client.chat.completions.create(
      {
        model,
        stop: params.stop,
        max_tokens: this.normalizeMaxTokens(params.maxTokens),
        temperature: params.temperature,
        messages: messages.map(({ role, content }) => ({ role: GPTLLMModel.RoleMapping[role], content })),
      },
      { timeout: options?.timeout ?? this.TIMEOUT }
    );

    return this.generateOutput(result);
  }

  async generateCompletion(prompt: string, params: AIParams, options?: CompletionOptions & { shouldThrow?: boolean }) {
    const messages: AIMessage[] = [{ role: AIMessageRole.USER, content: prompt }];

    return this.generateChatCompletion(messages, params, options);
  }

  private async generateAzureChatCompletion(
    messages: AIMessage[],
    params: AIParams,
    options?: CompletionOptions
  ): Promise<CompletionOutput> {
    try {
      const resolveCompletion = () =>
        this.callChatCompletion(messages, params, options, this.client.azureClient, this.azureConfig!.model);

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

  private async generateOpenAIChatCompletion(
    messages: AIMessage[],
    params: AIParams,
    options?: CompletionOptions
  ): Promise<CompletionOutput> {
    return this.callChatCompletion(messages, params, options, this.client.openAIClient);
  }

  protected routeChatCompletion(
    messages: AIMessage[],
    params: AIParams,
    options?: CompletionOptions
  ): Promise<CompletionOutput> {
    if (this.azureConfig && this.client.azureClient) return this.generateAzureChatCompletion(messages, params, options);

    return this.generateOpenAIChatCompletion(messages, params, options);
  }

  async generateChatCompletion(
    messages: AIMessage[],
    params: AIParams,
    options?: CompletionOptions
  ): Promise<CompletionOutput> {
    try {
      return await this.routeChatCompletion(messages, params, options);
    } catch (error: any) {
      this.logger.warn(
        { error: getOpenAIResponseError(error) ?? error, messages, params },
        `${this.modelRef} completion`
      );
      return EmptyCompletionOutput({ error: getOpenAIResponseError(error), model: this.modelRef });
    }
  }

  generateChatCompletionStream(
    messages: AIMessage[],
    params: AIParams,
    options?: CompletionOptions
  ): Observable<CompletionStreamOutput> {
    try {
      return this.callChatCompletionStream(messages, params, options);
    } catch (error: any) {
      this.logger.warn(
        { error: getOpenAIResponseError(error) ?? error, messages, params },
        `${this.modelRef} completion`
      );
      return of(emptyCompletionOutput(this.modelRef, getOpenAIResponseError(error) ?? 'Unknown error'));
    }
  }

  generateCompletionStream(
    prompt: string,
    params: AIParams,
    options?: CompletionOptions & { shouldThrow?: boolean }
  ): Observable<CompletionStreamOutput> {
    const messages: AIMessage[] = [{ role: AIMessageRole.USER, content: prompt }];

    return this.generateChatCompletionStream(messages, params, options);
  }
}
