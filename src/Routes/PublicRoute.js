import React from 'react';
import { Route } from 'react-router-dom';

import PublicComponent from './PublicComponent';

const PublicRoute = ({ component, ...rest }) => (
  <Route {...rest} render={(route_props) => <PublicComponent {...route_props} {...rest} component={component} />} />
);

export default PublicRoute;
