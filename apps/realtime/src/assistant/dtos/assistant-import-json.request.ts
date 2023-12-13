import { z } from 'zod';

import { AssistantExportImportDataDTO } from './assistant-export-import-data.dto';

export const AssistantImportJSONRequest = z.object({
  data: AssistantExportImportDataDTO,
  workspaceID: z.string(),
});

export type AssistantImportJSONRequest = z.infer<typeof AssistantImportJSONRequest>;
