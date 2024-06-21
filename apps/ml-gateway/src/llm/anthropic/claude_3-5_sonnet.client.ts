import { AIModel } from '@voiceflow/dtos';

import { AnthropicMessageAIModel } from './anthropic-message.abstract';

export class CLAUDE_3_5_SONNET extends AnthropicMessageAIModel {
  TOKEN_MULTIPLIER = 5;

  modelRef = AIModel.CLAUDE_3_5_SONNET;

  anthropicModel = 'claude-3-5-sonnet-20240620';
}
