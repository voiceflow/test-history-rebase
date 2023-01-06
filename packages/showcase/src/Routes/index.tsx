import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Example from './Example';
import List from './List';

const Routes: React.OldFC = () => (
  <Switch>
    <Route path="/list" exact component={List} />
    <Route path="/:example" exact component={Example} />
    <Redirect to="/list" />
  </Switch>
);

export default Routes;
