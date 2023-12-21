import { SvgIconTypes } from '@voiceflow/ui';

import { InteractionModelTabType } from '@/constants';

interface EmptyViewProps {
  name: string;
  namePlural: string;
  description: string;
  link: string;
  svg: SvgIconTypes.Icon;
}

export const EMPTY_VIEW_META: Record<InteractionModelTabType, EmptyViewProps> = {
  [InteractionModelTabType.VARIABLES]: {
    name: 'Variable',
    namePlural: 'Variables',
    description: '',
    link: 'https://www.voiceflow.com/docs/workspaces-organizing-your-workspace',
    svg: 'noEntity',
  },
};
