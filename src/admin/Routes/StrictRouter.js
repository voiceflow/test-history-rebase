import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Page404 from '@/components/ErrorPages/404';

const StrictRouter = ({ children }) => (
  <Switch>
    {children}
    <Route component={Page404} />
  </Switch>
);

export default StrictRouter;
