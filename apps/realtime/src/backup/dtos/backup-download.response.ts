import { z } from 'nestjs-zod/z';

import { AssistantExportImportDataDTO } from '@/assistant/dtos/assistant-export-import-data.dto';

export const BackupDownloadResponse = z.object({
  data: AssistantExportImportDataDTO,
});

export type BackupDownloadResponse = z.infer<typeof BackupDownloadResponse>;
