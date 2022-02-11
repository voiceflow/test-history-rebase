import { ControlScheme, ZoomType } from '@/components/Canvas/constants';
import { BlockCategory } from '@/constants';

export interface UIState {
  creatorMenu: {
    activeMenu: string | null;
    isHidden: boolean;
  };
  blockMenu: {
    openSections: BlockCategory[];
  };
  local: Record<string, any>;
  canvasNavigation: ControlScheme;
  canvasOnly: boolean;
  previewing: boolean;
  zoomType: ZoomType;
  isLoadingProjects: boolean;
  commentsVisible: boolean;
}
