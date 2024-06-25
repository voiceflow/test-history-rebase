import type { Enum } from '@/utils/type/enum.util';

export const ResourceLevel = {
  Organization: 1,
  Workspace: 2,
  Assistant: 3,
} as const;

export type ResourceLevel = Enum<typeof ResourceLevel>;
