import { z } from 'nestjs-zod/z';

export const ProjectImportJSONResponse = z.object({
  _id: z.string(),
  name: z.string(),
  teamID: z.string(),
  devVersion: z.string().optional(),
});

export type ProjectImportJSONResponse = z.infer<typeof ProjectImportJSONResponse>;
