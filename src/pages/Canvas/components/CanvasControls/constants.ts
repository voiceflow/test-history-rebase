import { Permission } from '@/config/permissions';
import * as Tracking from '@/ducks/tracking';
import { Icon } from '@/svgs/types';

export type StaticResource = {
  icon: Icon;
  link: string;
  label: string;
  resourceName: Tracking.CanvasControlHelpMenuResource;
};

// eslint-disable-next-line import/prefer-default-export
export const STATIC_RESOURCES: StaticResource[] = [
  {
    icon: 'support',
    link: 'https://docs.voiceflow.com/',
    label: 'Docs',
    resourceName: Tracking.CanvasControlHelpMenuResource.DOCS,
  },
  {
    icon: 'youtube',
    link: 'https://www.youtube.com/channel/UCbqUIYQ7J2rS6C_nk4cNTxQ', // eslint-disable-line no-secrets/no-secrets
    label: 'Tutorials',
    resourceName: Tracking.CanvasControlHelpMenuResource.TUTORIALS,
  },
  {
    icon: 'template',
    link: 'https://airtable.com/shr36HKRwmglhZ5Lr/tblpYysnQuzqzmL0f?blocks=hide', // eslint-disable-line no-secrets/no-secrets
    label: 'Templates',
    resourceName: Tracking.CanvasControlHelpMenuResource.TUTORIALS,
  },
  {
    icon: 'community',
    link: 'https://www.facebook.com/groups/199476704186240/',
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
