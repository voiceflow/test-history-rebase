import { z } from 'zod';

import { KnowledgeBaseDocumentIntegrationType } from './document-integration-type.enum';
import { KnowledgeBaseDocumentType } from './document-type.enum';
import { KnowledgeBaseDocumentRefreshRate } from './knowledge-base-document-refresh-rate.enum';

export const KBDocumentPDFDataDTO = z
  .object({
    type: z.literal(KnowledgeBaseDocumentType.PDF),
    name: z.string(),
  })
  .strict();

export const KBDocumentDocxDataDTO = z
  .object({
    type: z.literal(KnowledgeBaseDocumentType.DOCX),
    name: z.string(),
  })
  .strict();

export const KBDocumentTextDataDTO = z
  .object({
    type: z.literal(KnowledgeBaseDocumentType.TEXT),
    name: z.string(),
    canEdit: z.boolean().optional(),
  })
  .strict();

export const KBDocumentUrlDataDTO = z
  .object({
    type: z.literal(KnowledgeBaseDocumentType.URL),
    name: z.string(),
    url: z.string(),
    refreshRate: z.nativeEnum(KnowledgeBaseDocumentRefreshRate).optional(),
    lastSuccessUpdate: z.string().optional(),
    accessTokenID: z.number().optional(),
    integrationExternalID: z.string().optional(),
    source: z.nativeEnum(KnowledgeBaseDocumentIntegrationType).optional(),
  })
  .strict();

export const KBDocumentTableDataDTO = z
  .object({
    type: z.literal(KnowledgeBaseDocumentType.TABLE),
    name: z.string(),
    rowsCount: z.number(),
  })
  .strict();

export const KBDocumentDataDTO = z.discriminatedUnion('type', [
  KBDocumentPDFDataDTO,
  KBDocumentDocxDataDTO,
  KBDocumentTextDataDTO,
  KBDocumentUrlDataDTO,
  KBDocumentTableDataDTO,
]);

export type KBDocumentData = z.infer<typeof KBDocumentDataDTO>;
