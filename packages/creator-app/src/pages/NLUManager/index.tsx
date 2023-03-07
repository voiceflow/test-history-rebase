import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { NLURoute, Path } from '@/config/routes';
import ProjectPage from '@/pages/Project/components/ProjectPage';

import { FirstUsePopper, NavigationSidebar } from './components';
import { useNLUManager } from './context';
import { EntityTable, IntentTable, UnclassifiedData } from './pages';
import * as S from './styles';

const NLUManager: React.FC = () => {
  const nluManager = useNLUManager();
  const previousTab = React.useRef(nluManager.activeTab || NLURoute.INTENTS);

  React.useEffect(() => {
    nluManager.goToTab(previousTab.current);
    nluManager.closeEditorTab();
  }, []);

  return (
    <ProjectPage>
      <S.Container>
        <NavigationSidebar />

        <S.Content onScroll={nluManager.handleScroll} ref={nluManager.activeTab === NLURoute.UNCLASSIFIED ? undefined : nluManager.tableRef}>
          <FirstUsePopper />

          <Switch>
            <Route path={Path.NLU_MANAGER_INTENTS} component={IntentTable} />
            <Route path={Path.NLU_MANAGER_ENTITIES} component={EntityTable} />
            <Route path={Path.NLU_MANAGER_UNCLASSIFIED} component={UnclassifiedData} />
          </Switch>
        </S.Content>
      </S.Container>
    </ProjectPage>
  );
};

export default NLUManager;
