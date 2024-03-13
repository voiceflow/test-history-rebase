import Client, { AI_PROMPT, HUMAN_PROMPT } from '@anthropic-ai/sdk';
import { AIMessage, AIMessageRole, AIParams } from '@voiceflow/dtos';
import { AnthropicStream } from 'ai';

import { LLMModel } from '../llm-model.abstract';
import { CompletionOutput } from '../llm-model.dto';
import { AnthropicConfig } from './anthropic.interface';

/**
 * @deprecated this is a legacy format, anthropic is transitioning to the messages API
 */
export abstract class AnthropicTextCompletionAIModel extends LLMModel {
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

  static RoleMap = {
    [AIMessageRole.SYSTEM]: HUMAN_PROMPT,
    [AIMessageRole.USER]: HUMAN_PROMPT,
    [AIMessageRole.ASSISTANT]: AI_PROMPT,
  };

  async * generateCompletion(prompt: string, params: AIParams): AsyncGenerator<CompletionOutput> {
    const messages: AIMessage[] = [{ role: AIMessageRole.USER, content: prompt }];
    if (params.system) messages.unshift({ role: AIMessageRole.SYSTEM, content: params.system });

    yield * this.generateChatCompletion(messages, params);
  }

  /**
   * Approximate the number of tokens used by the model based on the text length.
   * Uses 4 tokens per character as a rough estimate.
   */
  private calculateTokenUsage(text: string): number {
    return Math.floor((text.length / 4) * this.TOKEN_MULTIPLIER);
  }

  async * generateChatCompletion(messages: AIMessage[], params: AIParams): AsyncGenerator<CompletionOutput> {
    let topSystem = '';
    let prompt = '';
    for (let i = 0; i < messages.length; i++) {
      if (i === 0 && messages[i].role === AIMessageRole.SYSTEM) {
        topSystem = messages[i].content;
        continue;
      }
      if (i === 1 && topSystem) {
        // add the system prompt to the first message
        prompt += `${AnthropicTextCompletionAIModel.RoleMap[messages[i].role]} ${topSystem}\n${messages[i].content}`;
      } else {
        prompt += `${AnthropicTextCompletionAIModel.RoleMap[messages[i].role]} ${messages[i].content}`;
      }
    }
    // claude prompt must end with AI prompt
    prompt += AI_PROMPT;

    // const queryTokens = this.calculateTokenUsage(prompt);

    const result = await this.client.completions
      .create({
        prompt,
        model: this.anthropicModel,
        temperature: params.temperature,
        max_tokens_to_sample: this.normalizeMaxTokens(params.maxTokens) || this.defaultMaxTokens,
        stop_sequences: [HUMAN_PROMPT, ...(params.stop || [])],
        stream: true,
      })

    const stream = AnthropicStream(result);

    for await (const chunk of stream) {
      const output = chunk.completion?.trim() ?? null;
      const queryTokens = this.calculateTokenUsage(prompt);
      const answerTokens = this.calculateTokenUsage(output ?? '');
      const tokens = queryTokens + answerTokens;

      yield {
        output,
        tokens,
        queryTokens,
        answerTokens,
        multiplier: this.TOKEN_MULTIPLIER,
        model: this.modelRef,
      }
    }
  }
}
