import * as Documentation from '@/config/documentation';
import { Permission } from '@/config/permissions';
import { DOCS_LINK, FORUM_LINK, YOUTUBE_CHANNEL_LINK } from '@/constants';
import * as Tracking from '@/ducks/tracking';
import { Hotkey, HOTKEY_LABEL_MAP } from '@/keymap';
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
  MARKUP_TEXT = 'markup_text',
  MARKUP_IMAGE = 'markup_image',
  COMMENTING = 'commenting',
  ZOOM_IN = 'zoom_in',
  ZOOM_OUT = 'zoom_out',
}

export type CanvasControlMetaProps = {
  icon: Icon;
  title: string;
  hotkey: string;
  permission?: Permission;
};

export const CanvasControlMeta: Record<CanvasControl, CanvasControlMetaProps> = {
  [CanvasControl.START]: {
    title: 'Start',
    icon: 'home',
    hotkey: HOTKEY_LABEL_MAP[Hotkey.ROOT_NODE],
  },
  [CanvasControl.MODEL]: {
    title: 'Model',
    icon: 'code',
    hotkey: HOTKEY_LABEL_MAP[Hotkey.OPEN_CMS_MODAL],
    permission: Permission.EDIT_CANVAS,
  },
  [CanvasControl.COMMENTING]: {
    title: 'Commenting',
    icon: 'comment',
    hotkey: HOTKEY_LABEL_MAP[Hotkey.OPEN_COMMENTING],
  },
  [CanvasControl.MARKUP_TEXT]: {
    title: 'Text',
    icon: 'text',
    hotkey: HOTKEY_LABEL_MAP[Hotkey.ADD_MARKUP_TEXT],
  },
  [CanvasControl.MARKUP_IMAGE]: {
    title: 'Image',
    icon: 'markupImage',
    hotkey: HOTKEY_LABEL_MAP[Hotkey.ADD_MARKUP_IMAGE],
  },
  [CanvasControl.ZOOM_IN]: {
    title: 'Zoom In',
    icon: 'zoomIn',
    hotkey: HOTKEY_LABEL_MAP[Hotkey.ZOOM_IN],
  },
  [CanvasControl.ZOOM_OUT]: {
    title: 'Zoom Out',
    icon: 'zoomOut',
    hotkey: HOTKEY_LABEL_MAP[Hotkey.ZOOM_OUT],
  },
};
