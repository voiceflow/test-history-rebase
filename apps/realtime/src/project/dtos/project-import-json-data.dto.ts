import { DiagramDTO, ProjectDTO, VariableStateDTO, VersionDTO } from '@voiceflow/dtos';
import { z } from 'zod';

import { zodDeepStrip } from '@/utils/zod-deep-strip.util';

export const ProjectImportJSONData = z.object({
  project: zodDeepStrip(ProjectDTO),
  version: zodDeepStrip(VersionDTO),
  diagrams: z.record(zodDeepStrip(DiagramDTO.extend({ diagramID: z.string().optional() }))),
  _version: z.string().optional(),
  variableStates: z.array(zodDeepStrip(VariableStateDTO)).optional(),
});

export type ProjectImportJSONData = z.infer<typeof ProjectImportJSONData>;
