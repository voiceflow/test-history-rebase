import Client from '@anthropic-ai/sdk';
import { Logger } from '@nestjs/common';
import type { AIMessage, AIParams } from '@voiceflow/dtos';
import { AIMessageRole } from '@voiceflow/dtos';

import { LLMModel } from '../llm-model.abstract';
import type { CompletionOutput } from '../llm-model.dto';
import type { AnthropicConfig } from './anthropic.interface';
import { formatMessages } from './anthropic-message.util';

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
}
