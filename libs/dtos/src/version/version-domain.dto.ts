import { z } from 'zod';

export const VersionDomainDTO = z
  .object({
    id: z.string(),
    name: z.string(),
    live: z.boolean(),
    status: z.string().optional(),
    topicIDs: z.array(z.string()),
    updatedBy: z.number().optional(),
    updatedAt: z.string().optional(),
    rootDiagramID: z.string(),

    /**
     * @deprecated in favor of updatedBy
     * */
    updatedByCreatorID: z.number().optional().describe('@deprecated in favor of updatedBy'),
  })
  .strict();

export type VersionDomain = z.infer<typeof VersionDomainDTO>;
