import type { Enum } from '@/utils/type/enum.util';

export const RoleScope = {
  ORGANIZATION : 'organization',
  WORKSPACE : 'workspace',
  PROJECT : 'project',
  VERSION : 'version',
} as const;

export type RoleScope = Enum<typeof RoleScope>;
