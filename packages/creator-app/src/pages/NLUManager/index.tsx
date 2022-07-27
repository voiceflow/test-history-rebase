import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { Path } from '@/config/routes';
import { NLUManagerContext } from '@/pages/NLUManager/context';

import { NavigationSidebar } from './components';
import { EntityTable, IntentTable, VariableTable } from './pages';
import * as S from './styles';

const NLUManager: React.FC = () => {
  const nluManager = React.useContext(NLUManagerContext);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    nluManager.setIsScrolling(e.currentTarget.scrollTop > 0);
  };

  return (
    <S.Container>
      <NavigationSidebar />

      <S.Content onScroll={handleScroll}>
        <Switch>
          <Route path={Path.NLU_MANAGER_INTENTS} component={IntentTable} />
          <Route path={Path.NLU_MANAGER_ENTITIES} component={EntityTable} />
          <Route path={Path.NLU_MANAGER_VARIABLES} component={VariableTable} />

          <Redirect to={Path.NLU_MANAGER_INTENTS} />
        </Switch>
      </S.Content>
    </S.Container>
  );
};

export default NLUManager;
