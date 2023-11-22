import type { Enum } from '@/utils/type/enum.util';

export const ProjectPrivacy = {
  PUBLIC: 'public',
  PRIVATE: 'private',
} as const;

export type ProjectPrivacy = Enum<typeof ProjectPrivacy>;
