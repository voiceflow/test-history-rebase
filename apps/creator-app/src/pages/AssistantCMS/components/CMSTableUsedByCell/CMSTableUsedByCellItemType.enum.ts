import type { Enum } from '@voiceflow/dtos';

export const CMSTableUsedByCellItemType = {
  FLOW: 'flow',
  INTENT: 'intent',
  WORKFLOW: 'workflow',
} as const;

export type CMSTableUsedByCellItemType = Enum<typeof CMSTableUsedByCellItemType>;
