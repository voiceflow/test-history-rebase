import { z } from 'zod';

export const DocumentDeleteRequest = z.object({
  documentIDs: z.array(z.string()),
});

export type DocumentDeleteRequest = z.infer<typeof DocumentDeleteRequest>;

export const DocumentDeleteResponse = z.object({
  deletedDocumentIDs: z.array(z.string()),
});

export type DocumentDeleteResponse = z.infer<typeof DocumentDeleteResponse>;
