import { z } from 'zod';

import { CMSTabularResourceDTO } from '@/common';

import { KnowledgeBaseDocumentDTO } from './document/document.dto';

export const KnowledgeBaseDTO = CMSTabularResourceDTO.extend({
  documents: z.array(KnowledgeBaseDocumentDTO),
}).strict();

export type KnowledgeBase = z.infer<typeof KnowledgeBaseDTO>;
