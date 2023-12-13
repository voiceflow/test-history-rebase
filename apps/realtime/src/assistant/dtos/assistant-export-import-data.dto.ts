import { ProjectDTO, VariableStateDTO } from '@voiceflow/dtos';
import { z } from 'zod';

import { EnvironmentExportImportDTO } from '@/environment/dtos/environment-export-import-data.dto';
import { zodDeepStrip } from '@/utils/zod-deep-strip.util';

export const AssistantExportImportDataDTO = z
  .object({
    project: zodDeepStrip(ProjectDTO),
    _version: z.string().optional(),
    variableStates: z.array(zodDeepStrip(VariableStateDTO)).optional(),
  })
  .merge(EnvironmentExportImportDTO);

export type AssistantExportImportDataDTO = z.infer<typeof AssistantExportImportDataDTO>;
