import { UserRole } from '@voiceflow/internal';
import { z } from 'zod';

export const OrganizationLegacyMemberDTO = z.object({
  name: z.string(),
  role: z.nativeEnum(UserRole),
  email: z.string(),
  image: z.string().nullable(),
  creatorID: z.number(),
});

export type OrganizationLegacyMember = z.infer<typeof OrganizationLegacyMemberDTO>;
