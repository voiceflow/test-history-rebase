import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import ErrorBoundary from '@/components/ErrorPages/ErrorBoundary';
import { authTokenSelector } from '@/ducks/session';
import { connect } from '@/hocs';

const PrivateRoute = ({ component: Component, authToken, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      authToken ? (
        <ErrorBoundary>
          <Component {...props} {...rest} />
        </ErrorBoundary>
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            search: props.location.search,
            state: { from: props.location },
          }}
        />
      )
    }
  />
);

const mapStateToProps = {
  authToken: authTokenSelector,
};

export default connect(mapStateToProps)(PrivateRoute);
