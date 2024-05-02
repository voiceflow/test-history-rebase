import { z } from 'zod';

import { KnowledgeBaseDocumentRefreshRate } from '@/knowledge-base/document/knowledge-base-document-refresh-rate.enum';

export const RefreshJobDTO = z
  .object({
    id: z.string(),
    projectID: z.string(),
    documentID: z.string(),
    workspaceID: z.number(),
    url: z.string(),
    name: z.string(),
    executeAt: z.date(),
    refreshRate: z.nativeEnum(KnowledgeBaseDocumentRefreshRate),
    checksum: z.string().optional(),
    tags: z.array(z.string()).optional(),
    integrationOauthTokenID: z.number().optional(),
    integrationExternalID: z.string().optional(),
  })
  .strict();

export type RefreshJob = z.infer<typeof RefreshJobDTO>;
