import { AssistantDTO } from '@voiceflow/dtos';
import { z } from 'zod';

import { EnvironmentCMSExportDataDTO } from '@/environment/dtos/environment-cms-export-data.dto';

export const AssistantExportCMSResponse = z
  .object({
    assistant: AssistantDTO,
  })
  .merge(EnvironmentCMSExportDataDTO)
  .strict();

export type AssistantExportCMSResponse = z.infer<typeof AssistantExportCMSResponse>;
