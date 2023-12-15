export const QuotaName = {
  OPEN_API_TOKENS: 'OpenAI Tokens',
} as const;

export type QuotaName = (typeof QuotaName)[keyof typeof QuotaName];
