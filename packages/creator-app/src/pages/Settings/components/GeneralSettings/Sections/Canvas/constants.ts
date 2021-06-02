import { ProjectLinkType } from '@voiceflow/api-sdk';

import { ControlScheme } from '@/components/Canvas/constants';

export const NAVIGATION_DESCRIPTIONS = {
  [ControlScheme.TRACKPAD]: 'Pan the canvas by sliding two fingers on the trackpad. Zoom by pinching in and out.',
  [ControlScheme.MOUSE]: 'Click and drag to pan the canvas. Zoom by scrolling the mouse wheel.',
};

export const NAVIGATION_OPTIONS = [
  { id: ControlScheme.TRACKPAD, label: 'Trackpad' },
  { id: ControlScheme.MOUSE, label: 'Mouse' },
];

export const LINK_TYPE_OPTIONS = [
  { id: ProjectLinkType.STRAIGHT, label: 'Straight' },
  { id: ProjectLinkType.CURVED, label: 'Curved' },
];
