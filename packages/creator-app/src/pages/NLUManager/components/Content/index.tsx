import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { Path } from '@/config/routes';

import { Container } from './components';
import EntityTable from './components/EntityTable';
import FormSlider from './components/FormSlider';
import IntentTable from './components/IntentTable';
import VariableTable from './components/VariableTable';

const Content: React.FC = () => {
  return (
    <Container>
      <Switch>
        <Route path={Path.NLU_MANAGER_INTENTS} component={IntentTable} />
        <Route path={Path.NLU_MANAGER_ENTITIES} component={EntityTable} />
        <Route path={Path.NLU_MANAGER_VARIABLES} component={VariableTable} />
        <Redirect to={Path.NLU_MANAGER_INTENTS} />
      </Switch>
      <FormSlider />
    </Container>
  );
};

export default Content;
