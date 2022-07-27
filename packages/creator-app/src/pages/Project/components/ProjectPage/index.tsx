import React from 'react';
import { useRouteMatch } from 'react-router-dom';

import ProjectPageUI from '@/components/ProjectPage';
import * as UI from '@/ducks/ui';
import { useSelector } from '@/hooks';

import { DIAGRAM_ROUTES } from '../../constants';
import Header from '../Header';
import Sidebar, { SideBarComponentProps } from '../Sidebar';

interface ProjectPageProps {
  shouldRenderHeader?: boolean;
  sideBarProps?: SideBarComponentProps;
}

const ProjectPage: React.FC<ProjectPageProps> = ({ children, shouldRenderHeader = true, sideBarProps }) => {
  const canvasOnly = useSelector(UI.isCanvasOnlyShowingSelector);
  const isDiagramRoute = useRouteMatch(DIAGRAM_ROUTES);

  return (
    <ProjectPageUI
      scrollable={!isDiagramRoute}
      renderHeader={() => shouldRenderHeader && !canvasOnly && <Header />}
      renderSidebar={() => !canvasOnly && <Sidebar {...sideBarProps} />}
    >
      {children}
    </ProjectPageUI>
  );
};

export default ProjectPage;
