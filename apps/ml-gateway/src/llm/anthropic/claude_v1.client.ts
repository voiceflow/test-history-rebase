import { AIGPTModel } from '@voiceflow/dtos';

import { AnthropicAIModel } from './anthropic.abstract';

export class ClaudeV1 extends AnthropicAIModel {
  TOKEN_MULTIPLIER = 10;

  modelRef = AIGPTModel.CLAUDE_V1;

  anthropicModel = 'claude-v1';
}
