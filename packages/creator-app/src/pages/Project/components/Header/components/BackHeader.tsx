import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Page from '@/components/Page';
import { Path } from '@/config/routes';
import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';

const BackHeader: React.FC = () => {
  const goToCurrentCanvas = useDispatch(Router.goToCurrentCanvas);

  return (
    <Page.Header renderLogoButton={() => <Page.Header.BackButton onClick={() => goToCurrentCanvas()} />}>
      <Page.Header.Title>
        <Switch>
          <Route path={Path.PROJECT_TOOLS}>Products</Route>
          <Route path={Path.PROJECT_MIGRATE}>Migrate</Route>
          <Route path={Path.PROTOTYPE_WEBHOOK}>Prototype Webhook</Route>
        </Switch>
      </Page.Header.Title>
    </Page.Header>
  );
};

export default BackHeader;
