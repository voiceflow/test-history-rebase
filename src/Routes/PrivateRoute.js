import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

import ErrorBoundary from '../ErrorBoundary';
import { getAuth } from '../ducks/account';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      !getAuth() ? (
        <Redirect
          to={{
            pathname: '/login',
            search: props.location.search,
            state: { from: props.location },
          }}
        />
      ) : (
        <ErrorBoundary>
          <Component {...props} {...rest} />
        </ErrorBoundary>
      )
    }
  />
);

export default connect(
  null,
  { getAuth }
)(PrivateRoute);
