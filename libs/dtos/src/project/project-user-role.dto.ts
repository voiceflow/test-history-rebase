import { z } from 'zod';

import { UserRole } from '@/common';

export const ProjectUserRoleDTO = z.union([z.literal(UserRole.EDITOR), z.literal(UserRole.VIEWER)]);

export type ProjectUserRole = z.infer<typeof ProjectUserRoleDTO>;
