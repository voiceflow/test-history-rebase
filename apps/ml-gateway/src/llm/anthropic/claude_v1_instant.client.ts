import { AIModel } from '@voiceflow/dtos';

import { AnthropicTextCompletionAIModel } from './anthropic-text-completion.abstract';

export class ClaudeV1Instant extends AnthropicTextCompletionAIModel {
  modelRef = AIModel.CLAUDE_INSTANT_V1;

  TOKEN_MULTIPLIER = 1;

  anthropicModel = 'claude-instant-1.2';
}
