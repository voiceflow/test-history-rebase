import { KBDocumentDataDTO, KBDocumentStatus, KBDocumentUrlDataDTO, KnowledgeBaseDocumentDTO } from '@voiceflow/dtos';
import { z } from 'zod';

export const DocumentCreateManyURLsRequest = z.object({
  data: z.array(KBDocumentUrlDataDTO),
});
export type DocumentCreateManyURLsRequest = z.infer<typeof DocumentCreateManyURLsRequest>;
export const DocumentCreateOneURLRequest = z.object({
  data: KBDocumentUrlDataDTO,
});
export type DocumentCreateOneURLRequest = z.infer<typeof DocumentCreateOneURLRequest>;

export const DocumentCreateOnePublicRequestBody = z.object({
  data: KBDocumentUrlDataDTO,
});

export type DocumentCreateOnePublicRequestBody = z.infer<typeof DocumentCreateOnePublicRequestBody>;

export const DocumentCreateOnePublicRequestParams = z.object({
  overwrite: z.string().optional(),
  maxChunkSize: z.number().optional(),
  tags: z.array(z.string()).or(z.string()).optional(),
});

export type DocumentCreateOnePublicRequestParams = z.infer<typeof DocumentCreateOnePublicRequestParams>;

export const DocumentReplaceOnePublicRequestParams = z.object({
  maxChunkSize: z.number().optional(),
});

export type DocumentReplaceOnePublicRequestParams = z.infer<typeof DocumentCreateOnePublicRequestParams>;
export const DocumentCreateManyResponse = z.array(KnowledgeBaseDocumentDTO);
export type DocumentCreateManyResponse = z.infer<typeof DocumentCreateManyResponse>;
export const DocumentCreateResponse = KnowledgeBaseDocumentDTO;
export type DocumentCreateResponse = z.infer<typeof DocumentCreateResponse>;

export const DocumentCreateOnePublicResponse = z.object({
  data: z.object({
    tags: z.array(z.string()),
    documentID: z.string(),
    data: KBDocumentDataDTO.nullable(),
    updatedAt: z.string().datetime(),
    status: KBDocumentStatus,
  }),
});
export type DocumentCreateOnePublicResponse = z.infer<typeof DocumentCreateOnePublicResponse>;
