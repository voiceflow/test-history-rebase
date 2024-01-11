import { Logger } from '@nestjs/common';
import { AIGPTModel } from '@voiceflow/dtos';

import { GPTLLMModel } from './gpt.abstract';

export class GPT3_5 extends GPTLLMModel {
  protected logger = new Logger(GPT3_5.name);

  TOKEN_MULTIPLIER = 0.75;

  public modelRef = AIGPTModel.GPT_3_5_TURBO;

  protected openaiModelName = 'gpt-3.5-turbo';

  protected azureConfig = {
    model: 'gpt-3.5-turbo',
    deployment: 'vf-gpt35-turbo',
  };
}
