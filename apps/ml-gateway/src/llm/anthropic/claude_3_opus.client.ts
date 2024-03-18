import { AIModel } from '@voiceflow/dtos';

import { AnthropicMessageAIModel } from './anthropic-message.abstract';

export class Claude3Opus extends AnthropicMessageAIModel {
  TOKEN_MULTIPLIER = 20;

  modelRef = AIModel.CLAUDE_3_OPUS;

  anthropicModel = 'claude-3-opus-20240229';
}
