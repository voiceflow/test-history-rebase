import { KBDocumentChunkDTO, KBDocumentDataDTO, KBDocumentStatus, KnowledgeBaseDocumentDTO, KnowledgeBaseDocumentType } from '@voiceflow/dtos';
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

export const DocumentFindOnePublicResponse = z.object({
  chunks: z.array(KBDocumentChunkDTO).optional(),
  data: z
    .object({
      tags: z.array(z.string()),
      documentID: z.string(),
      data: KBDocumentDataDTO.nullable(),
      updatedAt: z.string().datetime(),
      status: KBDocumentStatus,
    })
    .nullable(),
});

export type DocumentFindOnePublicResponse = z.infer<typeof DocumentFindOnePublicResponse>;

/* Public */

export const DocumentFindManyPublicRequest = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  documentType: z.nativeEnum(KnowledgeBaseDocumentType).optional(),
  includeTags: z.array(z.string()).or(z.string()).optional(),
  excludeTags: z.array(z.string()).or(z.string()).optional(),
  includeAllTagged: z.string().optional(),
  includeAllNonTagged: z.string().optional(),
});

export type DocumentFindManyPublicRequest = z.infer<typeof DocumentFindManyPublicRequest>;

export const DocumentFindManyPublicQuery = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  documentType: z.nativeEnum(KnowledgeBaseDocumentType).optional(),
  includeTags: z.array(z.string()).or(z.string()).optional(),
  excludeTags: z.array(z.string()).or(z.string()).optional(),
  includeAllTagged: z.boolean().optional(),
  includeAllNonTagged: z.boolean().optional(),
});

export type DocumentFindManyPublicQuery = z.infer<typeof DocumentFindManyPublicQuery>;

export const DocumentFindManyPublicResponse = z.object({
  total: z.number(),
  data: z.array(
    z.object({
      tags: z.array(z.string()),
      documentID: z.string(),
      data: KBDocumentDataDTO.nullable(),
      updatedAt: z.string().datetime(),
      status: KBDocumentStatus,
    })
  ),
});

export type DocumentFindManyPublicResponse = z.infer<typeof DocumentFindManyPublicResponse>;
