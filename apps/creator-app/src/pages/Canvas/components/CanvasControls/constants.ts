import { SvgIconTypes } from '@voiceflow/ui';

import { DISCORD_LINK, LEARN_LINK, TEMPLATES_LINK, YOUTUBE_CHANNEL_LINK } from '@/constants/link.constant';
import * as Tracking from '@/ducks/tracking';

export interface StaticResource {
  icon: SvgIconTypes.Icon;
  link: string;
  label: string;
  resourceName: Tracking.CanvasControlHelpMenuResource;
}

export const STATIC_RESOURCES: StaticResource[] = [
  {
    icon: 'support',
    link: LEARN_LINK,
    label: 'Docs',
    resourceName: Tracking.CanvasControlHelpMenuResource.DOCS,
  },
  {
    icon: 'youtube',
    link: YOUTUBE_CHANNEL_LINK,
    label: 'Tutorials',
    resourceName: Tracking.CanvasControlHelpMenuResource.TUTORIALS,
  },
  {
    icon: 'template',
    link: TEMPLATES_LINK,
    label: 'Templates',
    resourceName: Tracking.CanvasControlHelpMenuResource.TUTORIALS,
  },
  {
    icon: 'community',
    link: DISCORD_LINK,
    label: 'Community',
    resourceName: Tracking.CanvasControlHelpMenuResource.COMMUNITY,
  },
];
