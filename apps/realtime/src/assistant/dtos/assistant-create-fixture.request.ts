import { z } from 'zod';

import { AssistantImportJSONRequest } from './assistant-import-json.request';

export const AssistantCreateFixtureRequest = AssistantImportJSONRequest.extend({
  userID: z.number(),
}).strict();

export type AssistantCreateFixtureRequest = z.infer<typeof AssistantCreateFixtureRequest>;
