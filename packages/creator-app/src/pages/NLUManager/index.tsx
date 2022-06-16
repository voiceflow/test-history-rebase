import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { Path } from '@/config/routes';

import { NavigationSidebar } from './components';
import { EntityTable, IntentTable, VariableTable } from './pages';
import * as S from './styles';

const NLUManager: React.FC = () => (
  <S.Container>
    <NavigationSidebar />

    <S.Content>
      <Switch>
        <Route path={Path.NLU_MANAGER_INTENTS} component={IntentTable} />
        <Route path={Path.NLU_MANAGER_ENTITIES} component={EntityTable} />
        <Route path={Path.NLU_MANAGER_VARIABLES} component={VariableTable} />

        <Redirect to={Path.NLU_MANAGER_INTENTS} />
      </Switch>
    </S.Content>
  </S.Container>
);

export default NLUManager;
