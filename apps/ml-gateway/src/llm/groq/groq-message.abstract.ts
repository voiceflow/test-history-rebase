import { Logger } from '@nestjs/common';
import { AIMessage, AIMessageRole, AIParams } from '@voiceflow/dtos';
import Client from 'groq-sdk';

import { LLMModel } from '../llm-model.abstract';
import { CompletionOutput } from '../llm-model.dto';
import { GroqConfig } from './groq.interface';
import { GroqRoleMap } from './groq-message.constant';

export abstract class GroqMessageAIModel extends LLMModel {
  private logger = new Logger(GroqMessageAIModel.name);

  protected abstract groqModel: string;

  protected readonly client: Client;

  protected defaultMaxTokens = 512;

  constructor(config: Partial<GroqConfig>) {
    super(config);

    if (!config.GROQ_API_KEY) {
      throw new Error('Groq client not initialized');
    }

    this.client = new Client({ apiKey: config.GROQ_API_KEY });
  }

  generateCompletion(prompt: string, params: AIParams): Promise<CompletionOutput> {
    const messages: AIMessage[] = [{ role: AIMessageRole.USER, content: prompt }];
    if (params.system) messages.unshift({ role: AIMessageRole.SYSTEM, content: params.system });

    return this.generateChatCompletion(messages, params);
  }

  async generateChatCompletion(messages: AIMessage[], params: AIParams): Promise<CompletionOutput> {
    if (params.system) messages.unshift({ role: AIMessageRole.SYSTEM, content: params.system });

    const result = await this.client.chat.completions
      .create({
        messages: messages.map(({ role, content }) => ({ role: GroqRoleMap[role], content })),
        model: this.groqModel,
        temperature: params.temperature,
        max_tokens: this.normalizeMaxTokens(params.maxTokens) || this.defaultMaxTokens,
        stop: params.stop ?? null,
      })
      .catch((error: unknown) => {
        this.logger.warn({ error, messages, params }, `${this.modelRef} completion`);
        return null;
      });

    const output = result?.choices?.map((content) => content.message.content).join('\n') || null;

    const queryTokens = this.calculateTokenMultiplier(result?.usage?.prompt_tokens || 0);
    const answerTokens = this.calculateTokenMultiplier(result?.usage?.completion_tokens || 0);

    return {
      output,
      tokens: queryTokens + answerTokens,
      queryTokens,
      answerTokens,
      multiplier: this.TOKEN_MULTIPLIER,
      model: this.modelRef,
    };
  }

  generateCompletionStream() {
    return null as any;
  }

  generateChatCompletionStream() {
    return null as any;
  }
}
