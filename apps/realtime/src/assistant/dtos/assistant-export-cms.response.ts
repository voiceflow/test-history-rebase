import { AssistantDTO } from '@voiceflow/dtos';
import { z } from 'zod';

import { EnvironmentCMSExportImportDataDTO } from '@/environment/dtos/environment-cms-export-import-data.dto';

export const AssistantExportCMSResponse = z
  .object({
    assistant: AssistantDTO,
  })
  .merge(EnvironmentCMSExportImportDataDTO);

export type AssistantExportCMSResponse = z.infer<typeof AssistantExportCMSResponse>;
