import { AIMessageRole } from '@voiceflow/dtos';

export const AnthropicRole = {
  USER: 'user' as const,
  ASSISTANT: 'assistant' as const,
};
export type AnthropicRole = (typeof AnthropicRole)[keyof typeof AnthropicRole];

export const AnthropicRoleMap: Record<AIMessageRole, AnthropicRole> = {
  [AIMessageRole.SYSTEM]: AnthropicRole.USER,
  [AIMessageRole.USER]: AnthropicRole.USER,
  [AIMessageRole.ASSISTANT]: AnthropicRole.ASSISTANT,
};
