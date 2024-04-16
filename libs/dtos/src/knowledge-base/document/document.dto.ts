import { z } from 'zod';

import { CMSObjectResourceDTO } from '@/common';

import { KBDocumentDataDTO } from './document-data.dto';
import { KnowledgeBaseDocumentStatus } from './document-status.enum';

export const KnowledgeBaseDocumentDTO = CMSObjectResourceDTO.partial({
  updatedAt: true,
  updatedByID: true,
}).extend({
  creatorID: z.string(),
  documentID: z.string(),
  s3ObjectRef: z.string(),
  version: z.number().optional(),
  tags: z.array(z.string()).optional(),
  status: z.nativeEnum(KnowledgeBaseDocumentStatus),
  statusData: z.unknown(),
  folderID: z.string().nullable(),
  data: KBDocumentDataDTO,
  chunks: z
    .array(
      z.object({
        chunkID: z.string(),
        content: z.string(),
      })
    )
    .optional(),
});

export type KnowledgeBaseDocument = z.infer<typeof KnowledgeBaseDocumentDTO>;
