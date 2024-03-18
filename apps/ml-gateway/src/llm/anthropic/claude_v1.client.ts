import { AIModel } from '@voiceflow/dtos';

import { AnthropicTextCompletionAIModel } from './anthropic-text-completion.abstract';

export class ClaudeV1 extends AnthropicTextCompletionAIModel {
  TOKEN_MULTIPLIER = 10;

  modelRef = AIModel.CLAUDE_V1;

  anthropicModel = 'claude-v1';
}
