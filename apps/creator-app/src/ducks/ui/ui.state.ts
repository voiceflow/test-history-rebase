import { IS_MAC } from '@voiceflow/ui';

import { ControlScheme, ZoomType } from '@/components/Canvas/constants';

export interface UIState {
  zoomType: ZoomType;
  canvasOnly: boolean;
  canvasGrid: boolean;
  canvasSidebar?: {
    width?: number;
    visible: boolean;
  };
  commentsVisible: boolean;
  canvasNavigation: ControlScheme;
  topicThreadsOnly?: boolean;
  workflowThreadsOnly?: boolean;
  mentionedThreadsOnly?: boolean;

  /**
   * @deprecated
   */
  domainThreadsOnly?: boolean;
}

export const STATE_KEY = 'ui';

export const INITIAL_STATE: UIState = {
  zoomType: ZoomType.REGULAR,
  canvasGrid: true,
  canvasOnly: false,
  canvasSidebar: {
    visible: true,
  },
  commentsVisible: true,
  canvasNavigation: IS_MAC ? ControlScheme.TRACKPAD : ControlScheme.MOUSE,
};
