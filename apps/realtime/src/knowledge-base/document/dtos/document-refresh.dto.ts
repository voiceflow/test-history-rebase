import { KnowledgeBaseDocumentDTO } from '@voiceflow/dtos';
import { z } from 'zod';

export const DocumentRefreshRequest = z.object({
  documentIDs: z.array(z.string()),
});

export type DocumentRefreshRequest = z.infer<typeof DocumentRefreshRequest>;

export const DocumentRetryResponse = KnowledgeBaseDocumentDTO;

export type DocumentRetryResponse = z.infer<typeof DocumentRetryResponse>;
