import { z } from 'zod';

import { ProjectImportJSONData } from './project-import-json-data.dto';

export const ProjectImportJSONRequest = z.object({
  data: ProjectImportJSONData,
  workspaceID: z.string(),
});

export type ProjectImportJSONRequest = z.infer<typeof ProjectImportJSONRequest>;
