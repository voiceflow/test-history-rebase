import { AIGPTModel } from '@voiceflow/dtos';

import { AnthropicAIModel } from './anthropic.abstract';

export class ClaudeV1Instant extends AnthropicAIModel {
  modelRef = AIGPTModel.CLAUDE_INSTANT_V1;

  anthropicModel = 'claude-instant-1.2';
}
