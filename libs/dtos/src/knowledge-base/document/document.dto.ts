import { z } from 'zod';

import { KBDocumentChunkDTO } from './document-chunk.dto';
import { KBDocumentDataDTO } from './document-data.dto';
import { KBDocumentStatus } from './document-status.dto';

export const KnowledgeBaseDocumentDTO = z.object({
  updatedAt: z.string().datetime().optional(),
  creatorID: z.number(),
  documentID: z.string(),
  s3ObjectRef: z.string().optional(),
  version: z.number().optional(),
  tags: z.array(z.string()).optional(),
  status: KBDocumentStatus,
  folderID: z.string().nullable().optional(),
  data: KBDocumentDataDTO.nullable(),
  chunks: z.array(KBDocumentChunkDTO).optional(),
});

export type KnowledgeBaseDocument = z.infer<typeof KnowledgeBaseDocumentDTO>;
