import Client, { AI_PROMPT, HUMAN_PROMPT } from '@anthropic-ai/sdk';
import { Logger } from '@nestjs/common';
import { AIMessage, AIMessageRole, AIParams } from '@voiceflow/dtos';
import { from, map, mergeMap, Observable } from 'rxjs';

import { LLMModel } from '../llm-model.abstract';
import { CompletionOutput, CompletionStreamOutput } from '../llm-model.dto';
import { AnthropicConfig } from './anthropic.interface';

/**
 * @deprecated this is a legacy format, anthropic is transitioning to the messages API
 */
export abstract class AnthropicTextCompletionAIModel extends LLMModel {
  private logger = new Logger(AnthropicTextCompletionAIModel.name);

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
        prompt += `${AnthropicTextCompletionAIModel.RoleMap[messages[i].role]} ${topSystem}\n${messages[i].content}`;
      } else {
        prompt += `${AnthropicTextCompletionAIModel.RoleMap[messages[i].role]} ${messages[i].content}`;
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
        max_tokens_to_sample: this.normalizeMaxTokens(params.maxTokens) || this.defaultMaxTokens,
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

  generateCompletionStream(prompt: string, params: AIParams): Observable<CompletionStreamOutput> {
    const messages: AIMessage[] = [{ role: AIMessageRole.USER, content: prompt }];
    if (params.system) messages.unshift({ role: AIMessageRole.SYSTEM, content: params.system });

    return this.generateChatCompletionStream(messages, params);
  }

  generateChatCompletionStream(messages: AIMessage[], params: AIParams): Observable<CompletionStreamOutput> {
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

    const queryTokens = this.calculateTokenUsage(prompt);

    return from(
      this.client.completions
        .create({
          prompt,
          model: this.anthropicModel,
          temperature: params.temperature,
          max_tokens_to_sample: this.normalizeMaxTokens(params.maxTokens) || this.defaultMaxTokens,
          stop_sequences: [HUMAN_PROMPT, ...(params.stop || [])],
          stream: true,
        })
        .catch((error: unknown) => {
          this.logger.warn({ error, messages, params }, `${this.modelRef} completion`);
          return [];
        })
    ).pipe(
      mergeMap((chunk) => chunk),
      map((chunk, i) => {
        const output = chunk.completion?.trim() ?? null;

        const answerTokens = this.calculateTokenUsage(output ?? '');
        if (i > 0) {
          return {
            type: chunk.type,
            completion: {
              output,
              tokens: answerTokens,
              queryTokens: 0,
              answerTokens,
              multiplier: this.TOKEN_MULTIPLIER,
              model: this.modelRef,
            },
          };
        }
        return {
          type: chunk.type,
          completion: {
            output,
            tokens: queryTokens + answerTokens,
            queryTokens,
            answerTokens,
            multiplier: this.TOKEN_MULTIPLIER,
            model: this.modelRef,
          },
        };
      })
    );
  }
}
