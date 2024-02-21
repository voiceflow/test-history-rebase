import { z } from 'zod';

export const SubscriptionEntitlementsDTO = z.object({
  agentExports: z.boolean().nullable(),
  agents: z.number().nullable(),
  claude1: z.boolean().nullable(),
  claude2: z.boolean().nullable(),
  claudeInstant: z.boolean().nullable(),
  gpt: z.boolean().nullable(),
  gpt4: z.boolean().nullable(),
  gpt4Turbo: z.boolean().nullable(),
  interactionsLimit: z.number().nullable(),
  knowledgeBaseUpload: z.boolean().nullable(),
  prototypeLinks: z.boolean().nullable(),
  tokensLimit: z.number().nullable(),
  transcriptHistory: z.number().nullable(),
  userPersonas: z.number().nullable(),
  workspaces: z.number().nullable(),
});

export type SubscriptionEntitlements = z.infer<typeof SubscriptionEntitlementsDTO>;
