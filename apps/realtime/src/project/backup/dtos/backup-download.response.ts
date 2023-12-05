import { z } from 'nestjs-zod/z';

import { AssistantExportJSONResponse } from '@/assistant/dtos/assistant-export-json.response';

export const BackupDownloadResponse = z.object({
  data: AssistantExportJSONResponse,
});

export type BackupDownloadResponse = z.infer<typeof BackupDownloadResponse>;
