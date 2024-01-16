import { Logger } from '@nestjs/common';
import { AIGPTModel } from '@voiceflow/dtos';

import { GPTLLMModel } from './gpt.abstract';
import { OpenAIConfig } from './gpt.interface';

export class GPT4 extends GPTLLMModel {
  protected logger = new Logger(GPT4.name);

  TOKEN_MULTIPLIER = 25;

  public modelRef = AIGPTModel.GPT_4;

  protected openaiModelName = 'gpt-4';

  constructor(config: OpenAIConfig) {
    // Azure is current to unstable with high latency spikes
    // const azureConfig = {
    //   model: 'gpt-4',
    //   deployment: 'vf-gpt4',
    //   race: false,
    // };

    super(config);
  }
}
