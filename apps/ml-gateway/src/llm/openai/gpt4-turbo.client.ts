import { Logger } from '@nestjs/common';
import { AIGPTModel } from '@voiceflow/dtos';

import { GPTLLMModel } from './gpt.abstract';
import { OpenAIConfig } from './gpt.interface';

export class GPT4Turbo extends GPTLLMModel {
  protected logger = new Logger(GPT4Turbo.name);

  TOKEN_MULTIPLIER = 12;

  public modelRef = AIGPTModel.GPT_4_TURBO;

  protected openaiModelName = 'gpt-4-1106-preview';

  constructor(config: OpenAIConfig) {
    const azureConfig = {
      model: 'gpt-4',
      deployment: 'vf-gpt4-turbo',
      // too expensive to try and race it against OpenAI
      race: false,
    };

    super(config, azureConfig);
  }
}
