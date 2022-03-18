import { InteractionModelTabType } from '@/constants';

interface TabMetaProps {
  canRename: boolean;
}

export const NLU_TAB_META: Record<InteractionModelTabType, TabMetaProps> = {
  [InteractionModelTabType.INTENTS]: {
    canRename: true,
  },
  [InteractionModelTabType.SLOTS]: {
    canRename: true,
  },
  [InteractionModelTabType.VARIABLES]: {
    canRename: false,
  },
};
