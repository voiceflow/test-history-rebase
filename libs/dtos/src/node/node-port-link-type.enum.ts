import type { Enum } from '@/utils/type/enum.util';

export const NodePortLinkType = {
  CURVED: 'CURVED',
  STRAIGHT: 'STRAIGHT',
} as const;

export type NodePortLinkType = Enum<typeof NodePortLinkType>;
