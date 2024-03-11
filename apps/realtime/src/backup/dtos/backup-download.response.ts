import { z } from 'nestjs-zod/z';

import { AssistantImportDataDTO } from '@/assistant/dtos/assistant-import-data.dto';

export const BackupDownloadResponse = z.object({
  data: AssistantImportDataDTO,
});

export type BackupDownloadResponse = z.infer<typeof BackupDownloadResponse>;
