import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { Path } from '@/config/routes';
import ProjectPage from '@/pages/Project/components/ProjectPage';

import { NavigationSidebar } from './components';
import { useNLUManager } from './context';
import { EntityTable, IntentTable, UnclassifiedData } from './pages';
import * as S from './styles';

const NLUManager: React.FC = () => {
  const nluManager = useNLUManager();

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    nluManager.setIsScrolling(e.currentTarget.scrollTop > 0);
  };

  React.useEffect(() => {
    nluManager.closeEditorTab();
    nluManager.fetchClarity();
  }, []);

  return (
    <ProjectPage sideBarProps={{ withLogo: !!nluManager.inFullScreenTab }} shouldRenderHeader={!nluManager.inFullScreenTab}>
      <S.Container>
        <NavigationSidebar />

        <S.Content onScroll={handleScroll}>
          <Switch>
            <Route path={Path.NLU_MANAGER_INTENTS} component={IntentTable} />
            <Route path={Path.NLU_MANAGER_ENTITIES} component={EntityTable} />
            <Route path={Path.NLU_MANAGER_UNCLASSIFIED} component={UnclassifiedData} />

            <Redirect to={Path.NLU_MANAGER_INTENTS} />
          </Switch>
        </S.Content>
      </S.Container>
    </ProjectPage>
  );
};

export default NLUManager;
