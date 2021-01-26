import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import LoginForm from '@/admin/pages/login';

const PublicRouter = () => (
  <Switch>
    <Route path="/login" component={LoginForm} />
    <Redirect to="/login" />
  </Switch>
);

export default PublicRouter;
