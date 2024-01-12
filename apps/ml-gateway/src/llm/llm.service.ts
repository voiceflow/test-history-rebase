import { Inject, Injectable } from '@nestjs/common';
import { AIGPTModel } from '@voiceflow/dtos';
import { BadRequestException } from '@voiceflow/exception';
import { ENVIRONMENT_VARIABLES } from '@voiceflow/nestjs-env';

import type { EnvironmentVariables } from '@/app.env';

import { ClaudeV1 } from './anthropic/claude_v1.client';
import { ClaudeV1Instant } from './anthropic/claude_v1_instant.client';
import { ClaudeV2 } from './anthropic/claude_v2.client';
import { LLMModel } from './llm-model.abstract';
import { GPT3_5 } from './openai/gpt3-5.client';
import { GPT4 } from './openai/gpt4.client';
import { GPT4Turbo } from './openai/gpt4-turbo.client';

@Injectable()
export class LLMService {
  private DEFAULT_MODEL = AIGPTModel.GPT_3_5_TURBO;

  // this just ensures it extends the LLMModel class
  models: Partial<Record<AIGPTModel, new (...args: ConstructorParameters<typeof LLMModel>) => LLMModel>> = {};

  constructor(
    @Inject(ENVIRONMENT_VARIABLES)
    private env: EnvironmentVariables
  ) {
    this.models = {
      // reroute all GPT 3 requests to GPT 3.5
      [AIGPTModel.DaVinci_003]: GPT3_5,
      [AIGPTModel.GPT_3_5_TURBO]: GPT3_5,
      [AIGPTModel.GPT_4]: GPT4,
      [AIGPTModel.GPT_4_TURBO]: GPT4Turbo,
      [AIGPTModel.CLAUDE_V1]: ClaudeV1,
      [AIGPTModel.CLAUDE_V2]: ClaudeV2,
      [AIGPTModel.CLAUDE_INSTANT_V1]: ClaudeV1Instant,
    };
  }

  get(modelName: AIGPTModel = this.DEFAULT_MODEL, config: Partial<EnvironmentVariables> = this.env): LLMModel {
    const Model = this.models[modelName];
    if (!Model) throw new BadRequestException(`model ${modelName} not found`);

    return new Model(config);
  }
}
