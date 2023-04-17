import { InteractionModelTabType } from '@/constants';

import HeaderOptions from './components/HeaderOptions';
import IntentHeaderOptions from './components/IntentHeaderOptions';

export const tabHeaderComponentsMap = {
  [InteractionModelTabType.INTENTS]: IntentHeaderOptions,
  [InteractionModelTabType.SLOTS]: HeaderOptions,
  [InteractionModelTabType.VARIABLES]: HeaderOptions,
};
