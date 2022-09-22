import { SvgIconTypes } from '@voiceflow/ui';

import { NLURoute } from '@/config/routes';

interface EmptyViewProps {
  name: string;
  namePlural: string;
  description: string;
  link: string;
  svg: SvgIconTypes.Icon;
}

export const EMPTY_VIEW_META: Partial<Record<NLURoute, EmptyViewProps>> = {
  [NLURoute.INTENTS]: {
    name: 'Intent',
    namePlural: 'Intents',
    description: 'Intents are a collection of sample phrases that aim to understand a users motivation.',
    link: 'https://www.voiceflow.com/docs/workspaces-organizing-your-workspace',
    svg: 'noIntent',
  },
  [NLURoute.ENTITIES]: {
    name: 'Entity',
    namePlural: 'Entities',
    description: 'Entities help to pick out important pieces of information in a user reply.',
    link: 'https://www.voiceflow.com/docs/workspaces-organizing-your-workspace',
    svg: 'noEntity',
  },
};
