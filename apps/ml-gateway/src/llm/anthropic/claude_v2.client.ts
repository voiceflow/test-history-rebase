import { AIModel } from '@voiceflow/dtos';

import { AnthropicAIModel } from './anthropic.abstract';

export class ClaudeV2 extends AnthropicAIModel {
  TOKEN_MULTIPLIER = 10;

  modelRef = AIModel.CLAUDE_V2;

  anthropicModel = 'claude-2';
}
