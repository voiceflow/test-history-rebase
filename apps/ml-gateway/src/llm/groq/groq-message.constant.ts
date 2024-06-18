import { AIMessageRole } from '@voiceflow/dtos';

export const GroqRole = {
  USER: 'user' as const,
  ASSISTANT: 'assistant' as const,
  SYSTEM: 'system' as const,
};
export type GroqRole = (typeof GroqRole)[keyof typeof GroqRole];

export const GroqRoleMap: Record<AIMessageRole, GroqRole> = {
  [AIMessageRole.SYSTEM]: GroqRole.SYSTEM,
  [AIMessageRole.USER]: GroqRole.USER,
  [AIMessageRole.ASSISTANT]: GroqRole.ASSISTANT,
};
