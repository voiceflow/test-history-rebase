import React from 'react';
import { useRouteMatch } from 'react-router-dom';

import { BlockType } from '@/constants';
import * as UI from '@/ducks/ui';
import { useHideVoiceflowAssistant, useSelector } from '@/hooks';
import { MarkupContext } from '@/pages/Project/contexts';
import { useDisableModes } from '@/pages/Project/hooks';

import { DIAGRAM_ROUTES } from '../../constants';
import Header from '../Header';
import Sidebar from '../Sidebar';
import * as S from './styles';

const ProjectPage: React.FC<React.PropsWithChildren<{ sidebarPadding?: boolean }>> = ({ sidebarPadding, children }) => {
  const markup = React.useContext(MarkupContext);

  const canvasOnly = useSelector(UI.isCanvasOnlyShowingSelector);
  const onDisableModes = useDisableModes();
  const isDiagramRoute = useRouteMatch(DIAGRAM_ROUTES);

  useHideVoiceflowAssistant({ hide: canvasOnly });

  const isCreatingMarkupText = markup?.creatingType === BlockType.MARKUP_TEXT;

  return (
    <S.Page
      sidebarPadding={sidebarPadding}
      scrollable={!isDiagramRoute}
      renderHeader={() =>
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
            <Sidebar />
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
