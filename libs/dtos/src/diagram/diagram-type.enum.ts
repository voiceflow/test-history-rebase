import type { Enum } from '@/utils/type/enum.util';

export const DiagramType = {
  TOPIC: 'TOPIC',
  GROUP: 'GROUP',
  TEMPLATE: 'TEMPLATE',
  COMPONENT: 'COMPONENT',
} as const;

export type DiagramType = Enum<typeof DiagramType>;
