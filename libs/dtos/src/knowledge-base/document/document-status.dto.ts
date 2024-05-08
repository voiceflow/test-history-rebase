import { z } from 'zod';

import { KnowledgeBaseDocumentStatus } from './document-status.enum';

export const KBDocumentStatus = z.object({
  type: z.nativeEnum(KnowledgeBaseDocumentStatus),
  data: z.unknown(),
});

export type KBDocumentStatus = z.infer<typeof KBDocumentStatus>;
