import { Logger } from '@nestjs/common';
import { AIGPTModel } from '@voiceflow/dtos';

import { GPTLLMModel } from './gpt.abstract';

export class GPT3_5_0301 extends GPTLLMModel {
  protected logger = new Logger(GPT3_5_0301.name);

  TOKEN_MULTIPLIER = 0.75;

  public modelRef = AIGPTModel.GPT_3_5_TURBO_0301;

  protected openaiModelName = 'gpt-3.5-turbo-0301';

  // gpt-3.5-turbo-0301 not available on Azure OpenAI Canada East
}
