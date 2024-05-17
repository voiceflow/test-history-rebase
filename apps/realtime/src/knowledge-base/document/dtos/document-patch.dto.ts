import {
  KBDocumentDocxDataDTO,
  KBDocumentPDFDataDTO,
  KBDocumentTableDataDTO,
  KBDocumentTextDataDTO,
  KBDocumentUrlDataDTO,
  KnowledgeBaseDocumentDTO,
} from '@voiceflow/dtos';
import { z } from 'zod';

const PartialKBDocumentDataDTO = KBDocumentDocxDataDTO.partial()
  .or(KBDocumentPDFDataDTO.partial())
  .or(KBDocumentTableDataDTO.partial())
  .or(KBDocumentTextDataDTO.partial())
  .or(KBDocumentUrlDataDTO.partial());

const DocumentPatchManyData = KnowledgeBaseDocumentDTO.partial()
  .omit({ updatedAt: true, status: true, data: true })
  .and(z.object({ data: PartialKBDocumentDataDTO }))
  .and(z.object({ checksum: z.string().optional() }));

export const DocumentPatchManyRequest = z.object({
  patch: DocumentPatchManyData,
  documentIDs: z.array(z.string()),
});

export type DocumentPatchManyRequest = z.infer<typeof DocumentPatchManyRequest>;

export const DocumentPatchData = KnowledgeBaseDocumentDTO.partial()
  .omit({ updatedAt: true, data: true })
  .and(
    z.object({
      checksum: z.string().optional(),
      data: z.union([
        KBDocumentPDFDataDTO.partial(),
        KBDocumentDocxDataDTO.partial(),
        KBDocumentTextDataDTO.partial(),
        KBDocumentUrlDataDTO.partial(),
        KBDocumentTableDataDTO.partial(),
      ]),
    })
  );

export const DocumentPatchOneRequest = DocumentPatchData;

export type DocumentPatchOneRequest = z.infer<typeof DocumentPatchOneRequest>;
