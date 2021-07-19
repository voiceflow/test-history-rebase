import { InteractionModelTabType } from '@/constants';

export const TABS = [
  {
    value: InteractionModelTabType.INTENTS as string,
    label: 'Intents',
  },
  {
    value: InteractionModelTabType.SLOTS as string,
    label: 'Entities',
  },
  {
    value: InteractionModelTabType.VARIABLES as string,
    label: 'Variables',
  },
];
