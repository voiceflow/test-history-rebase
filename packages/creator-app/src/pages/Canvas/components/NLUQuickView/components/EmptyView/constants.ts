import { Icon } from '@voiceflow/ui';

import { InteractionModelTabType } from '@/constants';

interface EmptyViewProps {
  name: string;
  namePlural: string;
  description: string;
  link: string;
  svg: Icon;
}

export const EMPTY_VIEW_META: Record<InteractionModelTabType, EmptyViewProps> = {
  [InteractionModelTabType.INTENTS]: {
    name: 'intent',
    namePlural: 'intents',
    description: 'Intents are a collection of sample phrases that aim to understand a users motivation.',
    link: 'https://www.voiceflow.com/docs/workspaces-organizing-your-workspace',
    svg: 'noIntent',
  },
  [InteractionModelTabType.SLOTS]: {
    name: 'entity',
    namePlural: 'entities',
    description: 'Entities help to pick out important pieces of information in a user reply.',
    link: 'https://www.voiceflow.com/docs/workspaces-organizing-your-workspace',
    svg: 'noEntity',
  },
  [InteractionModelTabType.VARIABLES]: {
    name: 'variable',
    namePlural: 'variables',
    description: '',
    link: 'https://www.voiceflow.com/docs/workspaces-organizing-your-workspace',
    svg: 'noEntity',
  },
};
