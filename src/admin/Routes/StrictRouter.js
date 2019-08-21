import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Page404 from '@/components/ErrorPages/404';

function StrictRouter({ children }) {
  return (
    <Switch>
      {children}
      <Route component={Page404} />
    </Switch>
  );
}

export default StrictRouter;
