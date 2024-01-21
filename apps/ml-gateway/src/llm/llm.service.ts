import { Inject, Injectable } from '@nestjs/common';
import { AIModel } from '@voiceflow/dtos';
import { BadRequestException } from '@voiceflow/exception';
import { ENVIRONMENT_VARIABLES } from '@voiceflow/nestjs-env';

import type { EnvironmentVariables } from '@/app.env';

import { ClaudeV1 } from './anthropic/claude_v1.client';
import { ClaudeV1Instant } from './anthropic/claude_v1_instant.client';
import { ClaudeV2 } from './anthropic/claude_v2.client';
import { LLMModel } from './llm-model.abstract';
import { GPT3_5 } from './openai/gpt3-5.client';
import { GPT3_5_1106 } from './openai/gpt3-5-1106.client';
import { GPT4 } from './openai/gpt4.client';
import { GPT4Turbo } from './openai/gpt4-turbo.client';

@Injectable()
export class LLMService {
  private DEFAULT_MODEL = AIModel.GPT_3_5_TURBO;

  // this just ensures it extends the LLMModel class
  models: Partial<Record<AIModel, new (...args: ConstructorParameters<typeof LLMModel>) => LLMModel>> = {};

  constructor(
    @Inject(ENVIRONMENT_VARIABLES)
    private env: EnvironmentVariables
  ) {
    this.models = {
      // reroute all GPT 3 requests to GPT 3.5
      [AIModel.DaVinci_003]: GPT3_5,
      [AIModel.GPT_3_5_TURBO]: GPT3_5,
      [AIModel.GPT_3_5_TURBO_1106]: GPT3_5_1106,
      [AIModel.GPT_4]: GPT4,
      [AIModel.GPT_4_TURBO]: GPT4Turbo,
      [AIModel.CLAUDE_V1]: ClaudeV1,
      [AIModel.CLAUDE_V2]: ClaudeV2,
      [AIModel.CLAUDE_INSTANT_V1]: ClaudeV1Instant,
    };
  }

  get(modelName: AIModel = this.DEFAULT_MODEL, config: Partial<EnvironmentVariables> = this.env): LLMModel {
    const Model = this.models[modelName];
    if (!Model) throw new BadRequestException(`model ${modelName} not found`);

    return new Model(config);
  }
}
