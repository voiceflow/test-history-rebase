import { z } from 'zod';

import { RoleScope, UserRole } from '@/common';

export const OrganizationMemberDTO = z.object({
  name: z.string(),
  role: z.nativeEnum(UserRole),
  email: z.string(),
  image: z.string().nullable(),
  creatorID: z.number(),

  workspaceID: z.string().optional().nullable(),
  assistantID: z.string().optional().nullable(),
  organizationID: z.string().optional(),
  scope: z.nativeEnum(RoleScope).optional(),
});

export type OrganizationMember = z.infer<typeof OrganizationMemberDTO>;
