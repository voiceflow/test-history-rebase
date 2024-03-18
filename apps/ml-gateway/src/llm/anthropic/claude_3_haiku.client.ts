import { AIModel } from '@voiceflow/dtos';

import { AnthropicMessageAIModel } from './anthropic-message.abstract';

export class Claude3Haiku extends AnthropicMessageAIModel {
  TOKEN_MULTIPLIER = 0.5;

  modelRef = AIModel.CLAUDE_3_HAIKU;

  anthropicModel = 'claude-3-haiku-20240307';
}
