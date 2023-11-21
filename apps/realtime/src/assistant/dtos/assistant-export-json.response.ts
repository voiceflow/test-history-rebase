import { DiagramDTO, ProgramDTO, ProjectDTO, PrototypeProgramDTO, VariableStateDTO, VersionDTO } from '@voiceflow/dtos';
import { z } from 'zod';

export const AssistantExportJSONResponse = z.object({
  project: ProjectDTO,
  version: VersionDTO,
  diagrams: z.record(DiagramDTO),
  _version: z.string(),
  programs: z.record(ProgramDTO).optional(),
  variableStates: z.array(VariableStateDTO).optional(),
  prototypePrograms: z.record(PrototypeProgramDTO).optional(),
});

export type AssistantExportJSONResponse = z.infer<typeof AssistantExportJSONResponse>;
