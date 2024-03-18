import { AIModel } from '@voiceflow/dtos';

import { AnthropicMessageAIModel } from './anthropic-message.abstract';

export class Claude3Sonnet extends AnthropicMessageAIModel {
  TOKEN_MULTIPLIER = 5;

  modelRef = AIModel.CLAUDE_3_SONNET;

  anthropicModel = 'claude-3-sonnet-20240229';
}
