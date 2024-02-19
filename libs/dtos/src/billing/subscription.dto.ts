import { z } from 'zod';

export const SubscriptionDTO = z.object({
  id: z.string(),

  status: z.string(),
  nextBillingDate: z.string().optional().nullable(),
  billingPeriodUnit: z.string().optional().nullable(),

  trial: z
    .object({
      daysLeft: z.number(),
      endAt: z.string(),
    })
    .optional()
    .nullable(),

  plan: z.string(),
  editorSeats: z.number(),
  pricePerEditor: z.number(),

  planSeatLimits: z.object({
    editor: z.number(),
    viewer: z.number(),
  }),
  hasScheduledChanges: z.boolean().optional(),

  entitlements: z.object({
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
  }),
});

export type Subscription = z.infer<typeof SubscriptionDTO>;
