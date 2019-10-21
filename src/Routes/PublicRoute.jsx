import React from 'react';
import { Route } from 'react-router-dom';

import PublicComponent from './PublicComponent';

const PublicRoute = ({ component, ...props }) => (
  <Route {...props} render={(routeProps) => <PublicComponent {...routeProps} {...props} component={component} />} />
);

export default PublicRoute;
