import { AIModel } from '@voiceflow/dtos';

import { AnthropicTextCompletionAIModel } from './anthropic-text-completion.abstract';

export class ClaudeV2 extends AnthropicTextCompletionAIModel {
  TOKEN_MULTIPLIER = 10;

  modelRef = AIModel.CLAUDE_V2;

  anthropicModel = 'claude-2';
}
