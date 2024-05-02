import { KBDocumentUrlDataDTO, KnowledgeBaseDocumentDTO } from '@voiceflow/dtos';
import { z } from 'zod';

export const DocumentCreateManyURLsRequest = z.object({
  data: z.array(KBDocumentUrlDataDTO),
});
export type DocumentCreateManyURLsRequest = z.infer<typeof DocumentCreateManyURLsRequest>;
export const DocumentCreateOneURLRequest = z.object({
  data: KBDocumentUrlDataDTO,
});
export type DocumentCreateOneURLRequest = z.infer<typeof DocumentCreateOneURLRequest>;
export const DocumentCreateManyResponse = z.array(KnowledgeBaseDocumentDTO);
export type DocumentCreateManyResponse = z.infer<typeof DocumentCreateManyResponse>;
export const DocumentCreateResponse = KnowledgeBaseDocumentDTO;
export type DocumentCreateResponse = z.infer<typeof DocumentCreateResponse>;
