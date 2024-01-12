import Client, { AI_PROMPT, HUMAN_PROMPT } from '@anthropic-ai/sdk';
import { Logger } from '@nestjs/common';
import { AIMessage, AIMessageRole, AIParams } from '@voiceflow/dtos';

import { LLMModel } from '../llm-model.abstract';
import { CompletionOutput } from '../llm-model.dto';
import { AnthropicConfig } from './anthropic.interface';

export abstract class AnthropicAIModel extends LLMModel {
  private logger = new Logger(AnthropicAIModel.name);

  protected abstract anthropicModel: string;

  protected readonly client: Client;

  protected maxTokens = 128;

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

  generateCompletion(prompt: string, params: AIParams): Promise<CompletionOutput> {
    const messages: AIMessage[] = [{ role: AIMessageRole.USER, content: prompt }];
    if (params.system) messages.unshift({ role: AIMessageRole.SYSTEM, content: params.system });

    return this.generateChatCompletion(messages, params);
  }

  /**
   * Approximate the number of tokens used by the model based on the text length.
   * Uses 4 tokens per character as a rough estimate.
   */
  private calculateTokenUsage(text: string): number {
    return Math.floor((text.length / 4) * this.TOKEN_MULTIPLIER);
  }

  async generateChatCompletion(messages: AIMessage[], params: AIParams): Promise<CompletionOutput> {
    let topSystem = '';
    let prompt = '';
    for (let i = 0; i < messages.length; i++) {
      if (i === 0 && messages[i].role === AIMessageRole.SYSTEM) {
        topSystem = messages[i].content;
        continue;
      }
      if (i === 1 && topSystem) {
        // add the system prompt to the first message
        prompt += `${AnthropicAIModel.RoleMap[messages[i].role]} ${topSystem}\n${messages[i].content}`;
      } else {
        prompt += `${AnthropicAIModel.RoleMap[messages[i].role]} ${messages[i].content}`;
      }
    }
    // claude prompt must end with AI prompt
    prompt += AI_PROMPT;

    const queryTokens = this.calculateTokenUsage(prompt);

    const result = await this.client.completions
      .create({
        prompt,
        model: this.anthropicModel,
        temperature: params.temperature,
        max_tokens_to_sample: params.maxTokens || this.maxTokens,
        stop_sequences: [HUMAN_PROMPT, ...(params.stop || [])],
      })
      .catch((error: unknown) => {
        this.logger.warn({ error, messages, params }, `${this.modelRef} completion`);
        return null;
      });

    const output = result?.completion?.trim() ?? null;

    const answerTokens = this.calculateTokenUsage(output ?? '');

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
