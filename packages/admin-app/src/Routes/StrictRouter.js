import { Page404 } from '@voiceflow/ui';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

const StrictRouter = ({ children }) => (
  <Switch>
    {children}
    <Route component={Page404} />
  </Switch>
);

export default StrictRouter;
