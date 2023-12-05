import { z } from 'zod';

import { AssistantImportJSONDataDTO } from './assistant-import-json-data.dto';

export const AssistantImportJSONRequest = z.object({
  data: AssistantImportJSONDataDTO,
  workspaceID: z.string(),
});

export type AssistantImportJSONRequest = z.infer<typeof AssistantImportJSONRequest>;
