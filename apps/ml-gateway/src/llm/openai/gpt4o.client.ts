import { Logger } from '@nestjs/common';
import { AIModel } from '@voiceflow/dtos';

import { GPTLLMModel } from './gpt.abstract';
import { OpenAIConfig } from './gpt.interface';

export class GPT4O extends GPTLLMModel {
  protected logger = new Logger(GPT4O.name);

  TOKEN_MULTIPLIER = 6;

  public modelRef = AIModel.GPT_4O;

  protected openaiModelName = 'gpt-4o-2024-05-13';

  constructor(config: OpenAIConfig) {
    super(config);
  }
}
