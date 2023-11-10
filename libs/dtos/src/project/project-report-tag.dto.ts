import { z } from 'zod';

export const ProjectReportTagDTO = z
  .object({
    label: z.string(),
    tagID: z.string(),
  })
  .strict();

export type ProjectReportTag = z.infer<typeof ProjectReportTagDTO>;
