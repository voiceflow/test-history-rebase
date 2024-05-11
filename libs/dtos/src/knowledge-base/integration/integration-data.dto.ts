import { z } from 'zod';

import { KnowledgeBaseDocumentIntegrationType } from '../document/document-integration-type.enum';

export const IntegrationData = z.object({
  type: z.nativeEnum(KnowledgeBaseDocumentIntegrationType),
  state: z.string(),
  createdAt: z.string(),
  creatorID: z.number().nullable(),
});

export type IntegrationData = z.infer<typeof IntegrationData>;
