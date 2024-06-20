import { z } from 'zod';

export const SubscriptionEntitlementsDTO = z.object({
  samlSSO: z.boolean().nullable(),
  claude1: z.boolean().nullable(),
  claude2: z.boolean().nullable(),
  claude3Haiku: z.boolean().nullable(),
  claude3Sonnet: z.boolean().nullable(),
  claude3Opus: z.boolean().nullable(),
  claudeInstant: z.boolean().nullable(),
  gpt: z.boolean().nullable(),
  gpt4: z.boolean().nullable(),
  gpt4Turbo: z.boolean().nullable(),
  gpt4O: z.boolean().nullable(),
  geminiPro15: z.boolean().nullable(),
  agentsLimit: z.number().nullable(),
  versionHistoryLimit: z.number().nullable(),
  transcriptHistoryLimit: z.number().nullable(),
  personasLimit: z.number().nullable(),
  workspacesLimit: z.number().nullable(),
  knowledgeBaseSourcesLimit: z.number().nullable(),
  editorSeatsLimit: z.number().nullable(),
});

export type SubscriptionEntitlements = z.infer<typeof SubscriptionEntitlementsDTO>;
