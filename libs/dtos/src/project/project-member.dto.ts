import { z } from 'zod';

export const ProjectMemberDTO = z
  .object({
    creatorID: z.number(),
    platformData: z.record(z.unknown()),
  })
  .strict();

export type ProjectMember = z.infer<typeof ProjectMemberDTO>;
