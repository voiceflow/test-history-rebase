import { AIModel } from '@voiceflow/dtos';

import { AnthropicAIModel } from './anthropic.abstract';

export class ClaudeV1Instant extends AnthropicAIModel {
  modelRef = AIModel.CLAUDE_INSTANT_V1;

  anthropicModel = 'claude-instant-1.2';
}
