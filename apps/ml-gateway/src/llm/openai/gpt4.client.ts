import { Logger } from '@nestjs/common';
import { AIGPTModel } from '@voiceflow/dtos';

import { GPTLLMModel } from './gpt.abstract';

export class GPT4 extends GPTLLMModel {
  protected logger = new Logger(GPT4.name);

  TOKEN_MULTIPLIER = 25;

  public modelRef = AIGPTModel.GPT_4;

  protected openaiModelName = 'gpt-4';

  protected azureConfig = {
    model: 'gpt-4',
    deployment: 'vf-gpt4',
  };
}
