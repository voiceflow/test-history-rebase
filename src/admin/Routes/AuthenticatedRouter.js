import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import Admin from '@/admin/Admin';

import StrictRouter from './StrictRouter';

function AuthenticatedRouter() {
  return (
    <StrictRouter>
      <Redirect path="/" exact to="/admin" />
      <Route path="/admin" component={Admin} />
    </StrictRouter>
  );
}

export default AuthenticatedRouter;
