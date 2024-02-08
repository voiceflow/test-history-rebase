import type { UserRole } from '@voiceflow/internal';
import { z } from 'zod';

export const OrganizationMemberDTO = z.object({
  name: z.string(),
  role: z.string(),
  email: z.string(),
  image: z.string().nullable(),
  creatorID: z.number(),
});

export interface OrganizationMember extends Omit<z.infer<typeof OrganizationMemberDTO>, 'role'> {
  role: UserRole;
}
