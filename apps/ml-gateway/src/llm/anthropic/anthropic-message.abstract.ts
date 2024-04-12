import Client from '@anthropic-ai/sdk';
import { AIMessage, AIMessageRole, AIParams } from '@voiceflow/dtos';
import { AnthropicStream } from 'ai';

import { LLMModel } from '../llm-model.abstract';
import { CompletionOutput } from '../llm-model.dto';
import { AnthropicConfig } from './anthropic.interface';
import { formatMessages } from './anthropic-message.util';

export abstract class AnthropicMessageAIModel extends LLMModel {
  protected abstract anthropicModel: string;

  protected readonly client: Client;

  protected defaultMaxTokens = 128;

  constructor(config: Partial<AnthropicConfig>) {
    super(config);

    if (!config.ANTHROPIC_API_KEY) {
      throw new Error(`Anthropic client not initialized`);
    }

    this.client = new Client({ apiKey: config.ANTHROPIC_API_KEY });
  }

  async *generateCompletion(prompt: string, params: AIParams): AsyncGenerator<CompletionOutput> {
    const messages: AIMessage[] = [{ role: AIMessageRole.USER, content: prompt }];
    if (params.system) messages.unshift({ role: AIMessageRole.SYSTEM, content: params.system });

    yield* this.generateChatCompletion(messages, params);
  }

  async *generateChatCompletion(messages: AIMessage[], params: AIParams): AsyncGenerator<CompletionOutput> {
    const result = await this.client.messages.create({
      system: params.system,
      messages: formatMessages(messages),
      model: this.anthropicModel,
      temperature: params.temperature,
      max_tokens: this.normalizeMaxTokens(params.maxTokens) || this.defaultMaxTokens,
      stop_sequences: [...(params.stop || [])],
      stream: true,
    });

    const stream = AnthropicStream(result);

    for await (const chunk of stream) {
      const output = chunk?.content?.map((content: { text: string }) => content.text.trim()).join('\n') || null;
      const queryTokens = this.calculateTokenMultiplier(chunk.usage.input_tokens || 0);
      const answerTokens = this.calculateTokenMultiplier(chunk.usage.output_tokens || 0);
      const tokens = queryTokens + answerTokens;

      yield {
        output,
        tokens,
        queryTokens,
        answerTokens,
        multiplier: this.TOKEN_MULTIPLIER,
        model: this.modelRef,
      };
    }
  }
}
