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

  plan: z.enum(['starter', 'pro', 'team', 'enterprise']),
  editorSeats: z.number(),
  pricePerEditor: z.number(),

  entitlements: z.object({
    samlSSO: z.boolean().nullable(),
    claude1: z.boolean().nullable(),
    claude2: z.boolean().nullable(),
    claudeInstant: z.boolean().nullable(),
    gpt: z.boolean().nullable(),
    gpt4: z.boolean().nullable(),
    gpt4Turbo: z.boolean().nullable(),
    agentsLimit: z.number().nullable(),
    versionHistoryLimit: z.number().nullable(),
    transcriptHistoryLimit: z.number().nullable(),
    personasLimit: z.number().nullable(),
    workspacesLimit: z.number().nullable(),
    knowledgeBaseSourcesLimit: z.number().nullable(),
    editorSeatsLimit: z.number().nullable(),
  }),
});

export type Subscription = z.infer<typeof SubscriptionDTO>;
