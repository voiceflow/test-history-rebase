import { Logger } from '@nestjs/common';
import { AIMessage, AIMessageRole, AIParams } from '@voiceflow/dtos';
import { ChatCompletion, ChatCompletionRole } from 'openai/resources/chat';
import { OpenAIStream } from 'ai';

import { LLMModel } from '../llm-model.abstract';
import { EmptyCompletionOutput } from '../llm-model.constant';
import type { CompletionOptions, CompletionOutput } from '../llm-model.dto';
import { AzureConfig, OpenAIConfig } from './gpt.interface';
import { OpenAIClient } from './openai-api.client';

export abstract class GPTLLMModel extends LLMModel {
  protected logger = new Logger(GPTLLMModel.name);

  protected abstract openaiModelName: string;

  protected readonly client: OpenAIClient;

  static RoleMapping = {
    [AIMessageRole.ASSISTANT]: 'assistant',
    [AIMessageRole.SYSTEM]: 'system',
    [AIMessageRole.USER]: 'user',
  } as const satisfies {
    [K in AIMessageRole]: ChatCompletionRole
  }

  // try using azure openai first, if it fails, defer to openai api
  constructor(protected config: OpenAIConfig, protected azureConfig?: AzureConfig) {
    super(config);

    this.client = new OpenAIClient(config, this.azureConfig?.deployment);
  }

  protected calculateTokenMultiplier(tokens: number): number {
    return Math.ceil(tokens * this.TOKEN_MULTIPLIER);
  }

  protected generateOutput(result?: ChatCompletion | null): CompletionOutput {
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

  protected async * callChatCompletion(
    messages: AIMessage[],
    params: AIParams,
    options?: CompletionOptions,
    client = this.client.client,
    model = this.openaiModelName
  ): AsyncGenerator<CompletionOutput> {
    if (!client) {
      const error = `Cant use ${this.modelRef} completion as no valid openAI configuration is set`;
      this.logger.warn(error);
      yield EmptyCompletionOutput({ error, model });
    }

    if (params.system) messages.unshift({ role: AIMessageRole.SYSTEM, content: params.system });

    const result = await client.chat.completions.create(
      {
        stream: true,
        model,
        stop: params.stop,
        max_tokens: this.normalizeMaxTokens(params.maxTokens),
        temperature: params.temperature,
        messages: messages.map(({ role, content }) => ({ role: GPTLLMModel.RoleMapping[role], content })),
      },
      { timeout: options?.timeout ?? this.TIMEOUT }
    );

    const stream = OpenAIStream(result);
    for await (const chunk of stream) {
      yield this.generateOutput(chunk);
    }
  }

  async * generateChatCompletion(messages: AIMessage[], params: AIParams, options?: CompletionOptions) {
    if (this.azureConfig && this.client.azureClient) yield* this.callChatCompletion(messages, params, options, this.client.azureClient, this.azureConfig.model);
    else yield * this.callChatCompletion(messages, params, options);
  }

  async * generateCompletion(prompt: string, params: AIParams, options?: CompletionOptions) {
    const messages: AIMessage[] = [{ role: AIMessageRole.USER, content: prompt }];

    yield * this.callChatCompletion(messages, params, options);
  }
}
