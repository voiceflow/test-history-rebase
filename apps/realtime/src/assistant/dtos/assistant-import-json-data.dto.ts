import { DiagramDTO, ProjectDTO, VariableStateDTO, VersionDTO } from '@voiceflow/dtos';
import { z } from 'zod';

import { EnvironmentCMSExportImportDataDTO } from '@/environment/dtos/environment-cms-export-import-data.dto';
import { zodDeepStrip } from '@/utils/zod-deep-strip.util';

export const AssistantImportJSONDataDTO = z
  .object({
    project: zodDeepStrip(ProjectDTO),
    version: zodDeepStrip(VersionDTO),
    diagrams: z.record(zodDeepStrip(DiagramDTO.extend({ diagramID: z.string().optional() }))),
    _version: z.string().optional(),
    variableStates: z.array(zodDeepStrip(VariableStateDTO)).optional(),
  })
  .merge(EnvironmentCMSExportImportDataDTO.partial());

export type AssistantImportJSONDataDTO = z.infer<typeof AssistantImportJSONDataDTO>;
