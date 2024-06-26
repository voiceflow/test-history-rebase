import { VertexAI } from '@google-cloud/vertexai';
import { Inject, Injectable, Logger } from '@nestjs/common';
import type { AIMessage, AIParams } from '@voiceflow/dtos';
import { AIMessageRole } from '@voiceflow/dtos';
import { ENVIRONMENT_VARIABLES } from '@voiceflow/nestjs-env';
import { readFileSync } from 'fs';
import type { Observable } from 'rxjs';
import { concatMap, from, map } from 'rxjs';

import { LLMModel } from '../llm-model.abstract';
import type { CompletionOutput, CompletionStreamOutput } from '../llm-model.dto';
import type { GoogleConfig } from './google.interface';
import { formatRequest } from './google.util';

@Injectable()
export abstract class GoogleAIModel extends LLMModel {
  protected logger = new Logger(GoogleAIModel.name);

  protected abstract googleModelName: string;

  protected readonly client: VertexAI;

  constructor(
    @Inject(ENVIRONMENT_VARIABLES)
    config: Partial<GoogleConfig>
  ) {
    super(config);

    if (!config.GOOGLE_APPLICATION_CREDENTIALS) {
      throw new Error('Google client not initialized');
    }

    const googleConfig = JSON.parse(readFileSync(config.GOOGLE_APPLICATION_CREDENTIALS, 'utf8'));

    this.client = new VertexAI({ project: googleConfig.project_id });
  }

  generateCompletion(prompt: string, params: AIParams): Promise<CompletionOutput> {
    const messages: AIMessage[] = [{ role: AIMessageRole.USER, content: prompt }];
    return this.generateChatCompletion(messages, params);
  }

  async generateChatCompletion(messages: AIMessage[], params: AIParams): Promise<CompletionOutput> {
    const model = this.client.getGenerativeModel({
      model: this.googleModelName,
      generationConfig: { maxOutputTokens: params.maxTokens, temperature: params.temperature },
    });

    const request = formatRequest(messages, params);
    const result = await model.generateContent(request).catch((error: unknown) => {
      this.logger.warn({ error, messages, params }, `${this.modelRef} completion`);
      return null;
    });

    const output =
      result?.response?.candidates?.[0].content?.parts?.map((part) => part?.text?.trim()).join('\n') ?? null;
    const queryTokens = this.calculateTokenMultiplier(result?.response?.usageMetadata?.promptTokenCount ?? 0);
    const answerTokens = this.calculateTokenMultiplier(result?.response?.usageMetadata?.candidatesTokenCount ?? 0);

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
    return this.generateChatCompletionStream(messages, params);
  }

  generateChatCompletionStream(messages: AIMessage[], params: AIParams): Observable<CompletionStreamOutput> {
    const model = this.client.getGenerativeModel({
      model: this.googleModelName,
      generationConfig: { maxOutputTokens: params.maxTokens, temperature: params.temperature },
    });

    const request = formatRequest(messages, params);

    return from(model.generateContentStream(request)).pipe(
      concatMap((streamingResult) => from(streamingResult.response)),
      map((aggregatedResponse) => {
        const output = aggregatedResponse?.candidates?.[0].content?.parts?.[0].text ?? null;
        const queryTokens = this.calculateTokenMultiplier(aggregatedResponse?.usageMetadata?.promptTokenCount ?? 0);
        const answerTokens = this.calculateTokenMultiplier(
          aggregatedResponse?.usageMetadata?.candidatesTokenCount ?? 0
        );

        return {
          type: 'completion',
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
