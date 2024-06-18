import { AIModel } from '@voiceflow/dtos';

import { GroqMessageAIModel } from './groq-message.abstract';

export class GroqLlama3_70B extends GroqMessageAIModel {
  TOKEN_MULTIPLIER = 0.5;

  modelRef = AIModel.GROQ_LLAMA3_70B_8192;

  groqModel = 'llama3-70b-8192';
}
