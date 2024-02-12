import { IS_MAC } from '@voiceflow/ui';

import { ControlScheme, ZoomType } from '@/components/Canvas/constants';
import { BlockCategory } from '@/constants';

import { UIState } from './types';

export const STATE_KEY = 'ui';
export const INITIAL_STATE: UIState = {
  creatorMenu: {
    isHidden: false,
  },
  blockMenu: {
    openSections: [BlockCategory.RESPONSE, BlockCategory.USER_INPUT],
  },
  local: {},
  canvasNavigation: IS_MAC ? ControlScheme.TRACKPAD : ControlScheme.MOUSE,
  canvasOnly: false,
  zoomType: ZoomType.REGULAR,
  commentsVisible: true,
  canvasGrid: true,
  fullScreenMode: false,
};
