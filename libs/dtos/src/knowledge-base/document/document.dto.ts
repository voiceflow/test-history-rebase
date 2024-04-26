import { z } from 'zod';

import { KBDocumentChunkDTO } from './document-chunk.dto';
import { KBDocumentDataDTO } from './document-data.dto';
import { KnowledgeBaseDocumentStatus } from './document-status.enum';

export const KnowledgeBaseDocumentDTO = z.object({
  updatedAt: z.string().datetime().optional(),
  creatorID: z.number(),
  documentID: z.string(),
  s3ObjectRef: z.string(),
  version: z.number().optional(),
  tags: z.array(z.string()).optional(),
  status: z.object({
    type: z.nativeEnum(KnowledgeBaseDocumentStatus),
    data: z.unknown(),
  }),
  folderID: z.string().nullable().optional(),
  data: KBDocumentDataDTO.nullable(),
  chunks: z.array(KBDocumentChunkDTO).optional(),
});

export type KnowledgeBaseDocument = z.infer<typeof KnowledgeBaseDocumentDTO>;
