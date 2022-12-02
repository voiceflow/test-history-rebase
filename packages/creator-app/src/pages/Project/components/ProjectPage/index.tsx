import React from 'react';
import { useRouteMatch } from 'react-router-dom';

import { BlockType } from '@/constants';
import * as UI from '@/ducks/ui';
import { useSelector } from '@/hooks';
import { MarkupContext } from '@/pages/Project/contexts';
import { useDisableModes } from '@/pages/Project/hooks';

import { DIAGRAM_ROUTES } from '../../constants';
import Header from '../Header';
import Sidebar, { SideBarComponentProps } from '../Sidebar';
import * as S from './styles';

interface ProjectPageProps {
  shouldRenderHeader?: boolean;
  sideBarProps?: SideBarComponentProps;
}

const ProjectPage: React.FC<ProjectPageProps> = ({ children, shouldRenderHeader = true, sideBarProps }) => {
  const markup = React.useContext(MarkupContext);

  const canvasOnly = useSelector(UI.isCanvasOnlyShowingSelector);
  const onDisableModes = useDisableModes();
  const isDiagramRoute = useRouteMatch(DIAGRAM_ROUTES);

  const isCreatingMarkupText = markup?.creatingType === BlockType.MARKUP_TEXT;

  return (
    <S.Page
      scrollable={!isDiagramRoute}
      renderHeader={() =>
        shouldRenderHeader &&
        !canvasOnly && (
          <S.Content>
            <Header />
            {isCreatingMarkupText && <S.ClickableLayer onClick={onDisableModes} />}
          </S.Content>
        )
      }
      renderSidebar={() =>
        !canvasOnly && (
          <S.Content>
            <Sidebar {...sideBarProps} />
            {isCreatingMarkupText && <S.ClickableLayer onClick={onDisableModes} />}
          </S.Content>
        )
      }
      isCreatingMarkupText={isCreatingMarkupText}
    >
      {children}
    </S.Page>
  );
};

export default ProjectPage;
