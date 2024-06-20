import { z } from 'zod';

import { UserRole } from '@/common/enums/user-role.enum';

export const WorkspaceInvitationDTO = z.object({
  role: z.nativeEnum(UserRole),
  email: z.string(),
  expiry: z.string(),
  created: z.null(),
  creatorID: z.null(),
});

export type WorkspaceInvitation = z.infer<typeof WorkspaceInvitationDTO>;
