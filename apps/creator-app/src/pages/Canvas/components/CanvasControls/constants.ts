import { SvgIconTypes } from '@voiceflow/ui';

import * as Documentation from '@/config/documentation';
import { DISCORD_COMMUNITY_LINK, DOCS_LINK, YOUTUBE_CHANNEL_LINK } from '@/constants';
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
    link: DOCS_LINK,
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
    link: Documentation.USE_A_TEMPLATE,
    label: 'Templates',
    resourceName: Tracking.CanvasControlHelpMenuResource.TUTORIALS,
  },
  {
    icon: 'community',
    link: DISCORD_COMMUNITY_LINK,
    label: 'Community',
    resourceName: Tracking.CanvasControlHelpMenuResource.COMMUNITY,
  },
];
