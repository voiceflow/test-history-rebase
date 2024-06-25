import { AIModel } from '@voiceflow/dtos';

import { GoogleAIModel } from './google.abstract';

export class GeminiPro15 extends GoogleAIModel {
  TOKEN_MULTIPLIER = 8;

  public modelRef = AIModel.GEMINI_PRO_1_5;

  protected googleModelName = 'gemini-1.5-pro-001';
}
