import { z } from 'nestjs-zod/z';
import type { Merge } from 'type-fest';

import { ProjectImportJSONRequest } from './project-import-json.request';

export const ProjectCreateFixtureRequest = ProjectImportJSONRequest.extend({
  userID: z.number(),
}).strict();

export type ProjectCreateFixtureRequest = Merge<
  z.infer<typeof ProjectCreateFixtureRequest>,
  { data: ProjectImportJSONRequest['data'] }
>;
