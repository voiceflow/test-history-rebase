import { z } from 'zod';

import { AssistantImportDataDTO } from '@/assistant/dtos/assistant-import-data.dto';

export const ProjectImportJSONRequest = z.object({
  data: AssistantImportDataDTO,
  workspaceID: z.string(),
});

export type ProjectImportJSONRequest = z.infer<typeof ProjectImportJSONRequest>;
