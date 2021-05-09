import * as Documentation from '@/config/documentation';
import { Permission } from '@/config/permissions';
import { DOCS_LINK, FORUM_LINK, YOUTUBE_CHANNEL_LINK } from '@/constants';
import * as Tracking from '@/ducks/tracking';
import { Icon } from '@/svgs/types';

export type StaticResource = {
  icon: Icon;
  link: string;
  label: string;
  resourceName: Tracking.CanvasControlHelpMenuResource;
};

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
    link: FORUM_LINK,
    label: 'Community',
    resourceName: Tracking.CanvasControlHelpMenuResource.COMMUNITY,
  },
];

export enum CanvasControl {
  START = 'start',
  MODEL = 'model',
  MARKUP = 'markup',
  COMMENTING = 'commenting',
  ZOOM_IN = 'zoom_in',
  ZOOM_OUT = 'zoom_out',
}

export type CanvasControlMetaProps = {
  title: string;
  hotkey: string;
  icon?: Icon;
  permission?: Permission;
};

export const CanvasControlMeta: Record<CanvasControl, CanvasControlMetaProps> = {
  [CanvasControl.START]: {
    title: 'Start',
    icon: 'home',
    hotkey: 'S',
  },
  [CanvasControl.MODEL]: {
    title: 'Model',
    icon: 'code',
    hotkey: 'M',
    permission: Permission.EDIT_CANVAS,
  },
  [CanvasControl.COMMENTING]: {
    title: 'Commenting',
    hotkey: 'C',
  },
  [CanvasControl.MARKUP]: {
    title: 'Markup',
    hotkey: 'A',
  },
  [CanvasControl.ZOOM_IN]: {
    title: 'Zoom In',
    icon: 'zoomIn',
    hotkey: '-',
  },
  [CanvasControl.ZOOM_OUT]: {
    title: 'Zoom Out',
    icon: 'zoomOut',
    hotkey: '+',
  },
};
