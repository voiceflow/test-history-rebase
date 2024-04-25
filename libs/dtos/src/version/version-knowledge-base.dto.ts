import { z } from 'zod';

import { KnowledgeBaseDocumentDTO } from '@/knowledge-base/document/document.dto';

export const VersionKnowledgeBaseDocumentDataDTO = z
  .object({
    type: z.string().optional(),
    name: z.string().optional(),
  })
  .passthrough();

export type VersionKnowledgeBaseDocumentData = z.infer<typeof VersionKnowledgeBaseDocumentDataDTO>;

export const VersionKnowledgeBaseDocumentStatusDTO = z
  .object({
    type: z.string().optional(),
  })
  .passthrough();

export type VersionKnowledgeBaseDocumentStatus = z.infer<typeof VersionKnowledgeBaseDocumentStatusDTO>;

export const VersionKnowledgeBaseDocumentDTO = z
  .object({
    tags: z.array(z.string()).optional(),
    data: VersionKnowledgeBaseDocumentDataDTO.optional(),
    status: VersionKnowledgeBaseDocumentStatusDTO.optional(),
    version: z.number().optional(),
    updatedAt: z.string().optional(),
    creatorID: z.number().optional(),
    documentID: z.string().optional(),
    s3ObjectRef: z.string().optional(),
  })
  .strict();

export type VersionKnowledgeBaseDocument = z.infer<typeof VersionKnowledgeBaseDocumentDTO>;

export const VersionKnowledgeBaseSetFaqStatusDTO = z
  .object({
    type: z.string().optional(),
  })
  .passthrough();

export type VersionKnowledgeBaseSetFaqStatus = z.infer<typeof VersionKnowledgeBaseSetFaqStatusDTO>;

export const VersionKnowledgeBaseSetFaqDTO = z
  .object({
    tags: z.array(z.string()).optional(),
    name: z.string().optional(),
    status: VersionKnowledgeBaseSetFaqStatusDTO.optional(),
    version: z.number().optional(),
    faqSetID: z.string().optional(),
    updatedAt: z.string().optional(),
    creatorID: z.number().optional(),
  })
  .strict();

export type VersionKnowledgeBaseSetFaq = z.infer<typeof VersionKnowledgeBaseSetFaqDTO>;

export const VersionKnowledgeBaseTagDTO = z
  .object({
    tagID: z.string(),
    label: z.string(),
  })
  .strict();

export type VersionKnowledgeBaseTag = z.infer<typeof VersionKnowledgeBaseTagDTO>;

export const VersionKnowledgeBaseDTO = z
  .object({
    tags: z.record(VersionKnowledgeBaseTagDTO).optional(),
    faqSets: z.record(VersionKnowledgeBaseSetFaqDTO).optional(),
    settings: z.record(z.any()).optional(),
    documents: z.record(KnowledgeBaseDocumentDTO).optional(),
  })
  .strict();

export type VersionKnowledgeBase = z.infer<typeof VersionKnowledgeBaseDTO>;
