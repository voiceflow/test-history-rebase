import { z } from 'nestjs-zod/z';
import { Merge } from 'type-fest';

import { ProjectImportJSONRequest } from './project-import-json.request';

export const CreateProjectFixtureRequest = ProjectImportJSONRequest.extend({
  userID: z.number(),
}).strict();

export type CreateProjectFixtureRequest = Merge<z.infer<typeof CreateProjectFixtureRequest>, { data: ProjectImportJSONRequest['data'] }>;
