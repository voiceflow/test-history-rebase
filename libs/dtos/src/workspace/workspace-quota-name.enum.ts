export const WorkspaceQuotaName = {
  OPEN_AI_TOKENS: 'OpenAI Tokens',
} as const;

export type WorkspaceQuotaName = (typeof WorkspaceQuotaName)[keyof typeof WorkspaceQuotaName];
