import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import Admin from '@/Admin';

import StrictRouter from './StrictRouter';

const AuthenticatedRouter = () => (
  <StrictRouter>
    <Redirect path="/" exact to="/admin" />
    <Route path="/admin" component={Admin} />
  </StrictRouter>
);

export default AuthenticatedRouter;
