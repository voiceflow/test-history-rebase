import { ControlScheme, ZoomType } from '@/components/Canvas/constants';
import { BlockCategory } from '@/constants';

export interface UIState {
  creatorMenu: {
    isHidden: boolean;
  };
  blockMenu: {
    openSections: BlockCategory[];
  };
  local: Record<string, any>;
  canvasNavigation: ControlScheme;
  canvasOnly: boolean;
  zoomType: ZoomType;
  commentsVisible: boolean;
  topicThreadsOnly?: boolean;
  domainThreadsOnly?: boolean;
  mentionedThreadsOnly?: boolean;
  canvasGrid: boolean;
  fullScreenMode?: boolean;
}
