import { AIModel } from '@voiceflow/dtos';

import { GroqMessageAIModel } from './groq-message.abstract';

export class GroqMixtral_8x7b extends GroqMessageAIModel {
  TOKEN_MULTIPLIER = 0.5;

  modelRef = AIModel.GROQ_MIXTRAL_8X7B_32768;

  groqModel = 'mixtral-8x7b-32768';
}
