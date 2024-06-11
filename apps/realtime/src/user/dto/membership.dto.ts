import { RoleScope } from '@voiceflow/dtos';
import { z } from 'nestjs-zod/z';

export const MembershipDTO = z
  .object({
    workspaceID: z.string().optional().nullable(),
    assistantID: z.string().optional().nullable(),
    organizationID: z.string(),
    scope: z.nativeEnum(RoleScope),
  })
  .array();

export type Membership = z.infer<typeof MembershipDTO>;
