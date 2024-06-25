import Client from '@anthropic-ai/sdk';
import { Logger } from '@nestjs/common';
import type { AIMessage, AIParams } from '@voiceflow/dtos';
import { AIMessageRole } from '@voiceflow/dtos';
import type { Observable } from 'rxjs';
import { filter, from, map, mergeMap } from 'rxjs';

import { LLMModel } from '../llm-model.abstract';
import type { CompletionOutput, CompletionStreamOutput } from '../llm-model.dto';
import type { AnthropicConfig } from './anthropic.interface';
import { formatMessages, messageEventToCompletion } from './anthropic-message.util';

export abstract class AnthropicMessageAIModel extends LLMModel {
  private logger = new Logger(AnthropicMessageAIModel.name);

  protected abstract anthropicModel: string;

  protected readonly client: Client;

  protected defaultMaxTokens = 128;

  constructor(config: Partial<AnthropicConfig>) {
    super(config);

    if (!config.ANTHROPIC_API_KEY) {
      throw new Error('Anthropic client not initialized');
    }

    this.client = new Client({ apiKey: config.ANTHROPIC_API_KEY });
  }

  generateCompletion(prompt: string, params: AIParams): Promise<CompletionOutput> {
    const messages: AIMessage[] = [{ role: AIMessageRole.USER, content: prompt }];
    if (params.system) messages.unshift({ role: AIMessageRole.SYSTEM, content: params.system });

    return this.generateChatCompletion(messages, params);
  }

  async generateChatCompletion(messages: AIMessage[], params: AIParams): Promise<CompletionOutput> {
    const result = await this.client.messages
      .create({
        system: params.system,
        messages: formatMessages(messages),
        model: this.anthropicModel,
        temperature: params.temperature,
        max_tokens: this.normalizeMaxTokens(params.maxTokens) || this.defaultMaxTokens,
        stop_sequences: [...(params.stop || [])],
      })
      .catch((error: unknown) => {
        this.logger.warn({ error, messages, params }, `${this.modelRef} completion`);
        return null;
      });

    const output = result?.content?.map((content) => content.text.trim()).join('\n') || null;

    const queryTokens = this.calculateTokenMultiplier(result?.usage.input_tokens || 0);
    const answerTokens = this.calculateTokenMultiplier(result?.usage.output_tokens || 0);

    return {
      output,
      tokens: queryTokens + answerTokens,
      queryTokens,
      answerTokens,
      multiplier: this.TOKEN_MULTIPLIER,
      model: this.modelRef,
    };
  }

  generateCompletionStream(prompt: string, params: AIParams): Observable<CompletionStreamOutput> {
    const messages: AIMessage[] = [{ role: AIMessageRole.USER, content: prompt }];
    if (params.system) messages.unshift({ role: AIMessageRole.SYSTEM, content: params.system });

    return this.generateChatCompletionStream(messages, params);
  }

  generateChatCompletionStream(messages: AIMessage[], params: AIParams): Observable<CompletionStreamOutput> {
    return from(
      this.client.messages
        .create({
          system: params.system,
          messages: formatMessages(messages),
          model: this.anthropicModel,
          temperature: params.temperature,
          max_tokens: this.normalizeMaxTokens(params.maxTokens) || this.defaultMaxTokens,
          stop_sequences: [...(params.stop || [])],
          stream: true,
        })
        .catch((error: unknown) => {
          this.logger.warn({ error, messages, params }, `${this.modelRef} completion`);
          return [];
        })
    ).pipe(
      mergeMap((event) => event),
      map(
        messageEventToCompletion({
          model: this.modelRef,
          multiplier: this.TOKEN_MULTIPLIER,
        })
      ),
      filter((event): event is CompletionStreamOutput => event !== null),
      map((event) => {
        const answerTokens = this.calculateTokenMultiplier(event.completion.answerTokens);
        const queryTokens = this.calculateTokenMultiplier(event.completion.queryTokens);

        return {
          ...event,
          completion: {
            ...event.completion,
            answerTokens,
            queryTokens,
            tokens: answerTokens + queryTokens,
          },
        };
      })
    );
  }
}
