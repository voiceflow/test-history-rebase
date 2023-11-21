import { z } from 'zod';

import { AssistantImportJSONData } from './assistant-import-json-data.dto';

export const AssistantImportJSONRequest = z.object({
  data: AssistantImportJSONData,
  workspaceID: z.string(),
});

export type AssistantImportJSONRequest = z.infer<typeof AssistantImportJSONRequest>;
