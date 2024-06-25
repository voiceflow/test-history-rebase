import { Logger } from '@nestjs/common';
import { AIModel } from '@voiceflow/dtos';

import { GPTLLMModel } from './gpt.abstract';
import type { OpenAIConfig } from './gpt.interface';

export class GPT3_5_1106 extends GPTLLMModel {
  protected logger = new Logger(GPT3_5_1106.name);

  TOKEN_MULTIPLIER = 0.6;

  public modelRef = AIModel.GPT_3_5_TURBO_1106;

  protected openaiModelName = 'gpt-3.5-turbo-1106';

  constructor(config: OpenAIConfig) {
    const azureConfig = {
      model: 'gpt-3.5-turbo',
      deployment: 'vf-gpt35-turbo-1106',
      race: true,
    };

    super(config, azureConfig);
  }
}
