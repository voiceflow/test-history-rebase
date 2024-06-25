import { Logger } from '@nestjs/common';
import { AIModel } from '@voiceflow/dtos';

import { GPTLLMModel } from './gpt.abstract';
import type { OpenAIConfig } from './gpt.interface';

export class GPT4Turbo extends GPTLLMModel {
  protected logger = new Logger(GPT4Turbo.name);

  TOKEN_MULTIPLIER = 12;

  public modelRef = AIModel.GPT_4_TURBO;

  protected openaiModelName = 'gpt-4-1106-preview';

  constructor(config: OpenAIConfig) {
    // Azure is current to unstable with high latency spikes
    // const azureConfig = {
    //   model: 'gpt-4',
    //   deployment: 'vf-gpt4-turbo-test-quota',
    //   race: false,
    // };

    super(config);
  }
}
