import { z } from 'zod';

import { RoleScope, UserRole } from '@/common';
import { UserDTO } from '@/user/user.dto';

export const OrganizationMemberDTO = UserDTO.extend({
  creatorID: z.number(),
  scope: z.nativeEnum(RoleScope),
  role: z.nativeEnum(UserRole),
  organizationID: z.string(),
  workspaceID: z.string().nullable(),
  assistantID: z.string().nullable(),
});

export type OrganizationMember = z.infer<typeof OrganizationMemberDTO>;
