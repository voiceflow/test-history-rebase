import { AIGPTModel } from '@voiceflow/dtos';

import { AnthropicAIModel } from './anthropic.abstract';

export class ClaudeV2 extends AnthropicAIModel {
  TOKEN_MULTIPLIER = 10;

  modelRef = AIGPTModel.CLAUDE_V2;

  anthropicModel = 'claude-2';
}
