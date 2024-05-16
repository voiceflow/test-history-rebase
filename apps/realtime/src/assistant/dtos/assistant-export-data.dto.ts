import { ProgramDTO, ProjectDTO, VariableStateDTO } from '@voiceflow/dtos';
import { z } from 'zod';

import { EnvironmentExportDTO } from '@/environment/export/dtos/environment-export-data.dto';

export const AssistantOnlyExportDataDTO = z
  .object({
    project: ProjectDTO,
    _version: z.string().optional(),
    programs: z.record(ProgramDTO).optional(),
    variableStates: z.array(VariableStateDTO).optional(),
  })
  .strict();

export const AssistantExportDataDTO = AssistantOnlyExportDataDTO.merge(EnvironmentExportDTO).strict();

export type AssistantExportDataDTO = z.infer<typeof AssistantExportDataDTO>;
