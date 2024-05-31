import { z } from 'nestjs-zod/z';

export const OrganizationBaseRequestQuery = z.object({
  workspaceID: z.string(),
});

export type OrganizationBaseRequestQuery = z.infer<typeof OrganizationBaseRequestQuery>;
