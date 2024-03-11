import { z } from 'zod';

import { AssistantImportDataDTO } from './assistant-import-data.dto';

export const AssistantImportJSONRequest = z.object({
  data: AssistantImportDataDTO,
  workspaceID: z.string(),
});

export type AssistantImportJSONRequest = z.infer<typeof AssistantImportJSONRequest>;
