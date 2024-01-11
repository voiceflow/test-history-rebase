import { Logger } from '@nestjs/common';
import { AIGPTModel } from '@voiceflow/dtos';

import { GPTLLMModel } from './gpt.abstract';

export class GPT4Turbo extends GPTLLMModel {
  protected logger = new Logger(GPT4Turbo.name);

  TOKEN_MULTIPLIER = 12;

  public modelRef = AIGPTModel.GPT_4_TURBO;

  protected openaiModelName = 'gpt-4-1106-preview';

  protected azureConfig = {
    model: 'gpt-4',
    deployment: 'vf-gpt4-turbo',
  };
}
