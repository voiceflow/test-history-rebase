import { z } from 'zod';

import { UserRole } from '@/common';

export const OrganizationMemberDTO = z.object({
  name: z.string(),
  role: z.nativeEnum(UserRole),
  email: z.string(),
  image: z.string().nullable(),
  creatorID: z.number(),
});

export type OrganizationMember = z.infer<typeof OrganizationMemberDTO>;
