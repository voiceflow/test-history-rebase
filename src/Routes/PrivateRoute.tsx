import React from 'react';
import { Redirect, Route, RouteComponentProps } from 'react-router-dom';

import ErrorBoundary from '@/components/ErrorPages/ErrorBoundary';
import { authTokenSelector } from '@/ducks/session';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';

export type PrivateRouteProps<T extends object> = {
  path: string | string[];
  component: React.FC<T>;
} & Omit<T, keyof RouteComponentProps>;

const PrivateRoute = <T extends object>({ component: Component, authToken, ...rest }: PrivateRouteProps<T> & ConnectedPrivateRouteProps) => (
  <Route
    {...rest}
    render={(props) =>
      authToken ? (
        <ErrorBoundary>
          <Component {...props} {...(rest as any)} />
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

type ConnectedPrivateRouteProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(PrivateRoute) as {
  <T extends object>(props: PrivateRouteProps<T>): React.ReactElement;
};
