import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Header, HeaderBackButton, HeaderTitle } from '@/components/ProjectPage';
import { Path } from '@/config/routes';
import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';

const BackHeader: React.FC = () => {
  const goToCurrentCanvas = useDispatch(Router.goToCurrentCanvas);

  return (
    <Header renderLogoButton={() => <HeaderBackButton onClick={() => goToCurrentCanvas()} />}>
      <HeaderTitle>
        <Switch>
          <Route path={Path.PROJECT_TOOLS}>Products</Route>
          <Route path={Path.PROJECT_MIGRATE}>Migrate</Route>
          <Route path={Path.PROTOTYPE_WEBHOOK}>Prototype Webhook</Route>
        </Switch>
      </HeaderTitle>
    </Header>
  );
};

export default BackHeader;
