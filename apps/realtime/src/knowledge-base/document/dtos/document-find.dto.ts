import { KnowledgeBaseDocumentDTO } from '@voiceflow/dtos';
import { z } from 'zod';

export const DocumentFindManyRequest = z.object({
  documentIDs: z.array(z.string()).optional(),
});

export type DocumentFindManyRequest = z.infer<typeof DocumentFindManyRequest>;

export const DocumentFindOneResponse = KnowledgeBaseDocumentDTO.optional();

export type DocumentFindOneResponse = z.infer<typeof DocumentFindOneResponse>;

export const DocumentFindManyResponse = z.object({
  documents: z.array(KnowledgeBaseDocumentDTO),
});

export type DocumentFindManyResponse = z.infer<typeof DocumentFindManyResponse>;
