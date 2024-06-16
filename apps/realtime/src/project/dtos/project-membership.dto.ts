import { UserRole } from '@voiceflow/dtos';
import { z } from 'zod';

export const ProjectMembershipDTO = z
  .object({
    user: z.object({
      id: z.number(),
      name: z.string(),
      email: z.string(),
      image: z.string().nullable(),
      emailVerified: z.boolean(),
    }),
    membership: z.object({
      role: z.nativeEnum(UserRole),
      projectID: z.string(),
    }),
  })
  .strict();

export type ProjectMembershipDTO = z.infer<typeof ProjectMembershipDTO>;
