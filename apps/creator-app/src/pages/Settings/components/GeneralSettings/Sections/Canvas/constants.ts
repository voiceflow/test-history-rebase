import { BaseModels } from '@voiceflow/base-types';

import { ControlScheme, ZoomType } from '@/components/Canvas/constants';

export const NAVIGATION_DESCRIPTIONS = {
  [ControlScheme.TRACKPAD]: 'Pan the canvas with two fingers on the trackpad, zoom by pinching.',
  [ControlScheme.MOUSE]: 'Click and drag to pan the canvas. Zoom by scrolling the mouse wheel.',
};

export const NAVIGATION_OPTIONS = [
  { id: ControlScheme.TRACKPAD, label: 'Trackpad' },
  { id: ControlScheme.MOUSE, label: 'Mouse' },
];

export const ZOOM_OPTIONS = [
  { id: ZoomType.REGULAR, label: 'Regular' },
  { id: ZoomType.INVERSE, label: 'Inverse' },
];

export const LINK_TYPE_OPTIONS = [
  { id: BaseModels.Project.LinkType.STRAIGHT, label: 'Straight' },
  { id: BaseModels.Project.LinkType.CURVED, label: 'Curved' },
];
