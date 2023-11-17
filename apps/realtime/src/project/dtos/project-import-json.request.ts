import type { DiagramEntity, ProjectEntity, ToJSON, VariableStateEntity, VersionEntity } from '@voiceflow/orm-designer';
import { z } from 'nestjs-zod/z';
import { Merge } from 'type-fest';

export const ProjectImportJSONRequest = z.object({
  workspaceID: z.string(),
  data: z.object({
    project: z.record(z.any()),
    version: z.record(z.any()),
    diagrams: z.record(z.record(z.any())),
    _version: z.number().optional(),
    variableStates: z.array(z.any()).optional(),
  }),
});

export type ProjectImportJSONRequest = Merge<
  z.infer<typeof ProjectImportJSONRequest>,
  {
    data: {
      project: ToJSON<ProjectEntity>;
      version: ToJSON<VersionEntity>;
      diagrams: Record<string, ToJSON<DiagramEntity>>;
      _version?: number;
      variableStates?: ToJSON<VariableStateEntity>[];
    };
  }
>;
