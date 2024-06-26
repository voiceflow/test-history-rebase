import { KBDocumentDataDTO, KBDocumentStatus, KBDocumentUrlDataDTO, KnowledgeBaseDocumentDTO } from '@voiceflow/dtos';
import { MAX_METADATA_SIZE } from '@voiceflow/realtime-sdk/backend';
import { z } from 'zod';

export const KBDocumentUrlDataOptionalNameDTO = KBDocumentUrlDataDTO.extend({
  name: z.string().optional(),
});

export const DocumentCreateManyURLsRequest = z.object({
  data: z.array(KBDocumentUrlDataDTO),
});
export type DocumentCreateManyURLsRequest = z.infer<typeof DocumentCreateManyURLsRequest>;
export const DocumentCreateOneURLRequest = z.object({
  data: KBDocumentUrlDataDTO,
});
export type DocumentCreateOneURLRequest = z.infer<typeof DocumentCreateOneURLRequest>;

export const DocumentCreateOnePublicRequestBody = z.object({
  data: KBDocumentUrlDataOptionalNameDTO.extend({
    metadata: z
      .record(z.any())
      .optional()
      .refine(
        (value) => {
          if (value === undefined) return true; // If metadata is not provided, skip the validation

          const metadataString = JSON.stringify(value);
          return Buffer.byteLength(metadataString, 'utf8') <= MAX_METADATA_SIZE;
        },
        {
          message: 'The request metadata body field must be less than 40 KB.',
        }
      ),
  }),
});

export type DocumentCreateOnePublicRequestBody = z.infer<typeof DocumentCreateOnePublicRequestBody>;

export const DocumentCreateOnePublicRequestParams = z.object({
  overwrite: z.string().optional(),
  maxChunkSize: z.string().optional(),
  tags: z.array(z.string()).or(z.string()).optional(),
});

export type DocumentCreateOnePublicRequestParams = z.infer<typeof DocumentCreateOnePublicRequestParams>;

export const DocumentReplaceOnePublicRequestParams = z.object({
  maxChunkSize: z.string().optional(),
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

export const DocumentUploadTableRequestData = z.object({
  name: z.string(),
  searchableFields: z.array(z.string()),
  items: z.array(z.record(z.string(), z.any())),
  metadataFields: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});
export type DocumentUploadTableRequestData = z.infer<typeof DocumentUploadTableRequestData>;

export const DocumentUploadTableRequest = z.object({
  data: DocumentUploadTableRequestData,
});
export type DocumentUploadTableRequest = z.infer<typeof DocumentUploadTableRequest>;

export const DocumentUploadTableQuery = z.object({
  overwrite: z.string().optional(),
});
export type DocumentUploadTableQuery = z.infer<typeof DocumentUploadTableQuery>;

export const DocumentUploadTableResponse = z.object({
  data: KnowledgeBaseDocumentDTO.omit({ s3ObjectRef: true, creatorID: true, version: true, folderID: true }),
});

export type DocumentUploadTableResponse = z.infer<typeof DocumentUploadTableResponse>;
