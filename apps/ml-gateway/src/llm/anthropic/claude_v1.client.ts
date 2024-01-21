import { AIModel } from '@voiceflow/dtos';

import { AnthropicAIModel } from './anthropic.abstract';

export class ClaudeV1 extends AnthropicAIModel {
  TOKEN_MULTIPLIER = 10;

  modelRef = AIModel.CLAUDE_V1;

  anthropicModel = 'claude-v1';
}
