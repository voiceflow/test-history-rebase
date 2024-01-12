import { Logger } from '@nestjs/common';
import { AIGPTModel } from '@voiceflow/dtos';

import { GPTLLMModel } from './gpt.abstract';

export class GPT3_5_1106 extends GPTLLMModel {
  protected logger = new Logger(GPT3_5_1106.name);

  TOKEN_MULTIPLIER = 0.75;

  public modelRef = AIGPTModel.GPT_3_5_TURBO_1106;

  protected openaiModelName = 'gpt-3.5-turbo-1106';

  protected azureConfig = {
    model: 'gpt-3.5-turbo',
    deployment: 'vf-gpt35-turbo-1106',
  };
}
