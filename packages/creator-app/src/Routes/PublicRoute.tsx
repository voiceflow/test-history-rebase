import React from 'react';
import { Redirect, Route, RouteComponentProps } from 'react-router-dom';

import { Path } from '@/config/routes';
import { authTokenSelector } from '@/ducks/session';
import { connect } from '@/hocs/connect';
import { ConnectedProps } from '@/types';

export type PublicRouteProps<T extends object> = {
  path: string | string[];
  component: React.ComponentType<T>;
  name?: string;
  exact?: boolean;
} & Omit<T, keyof RouteComponentProps>;

const PublicRoute = <T extends object>({ component: Component, authToken, ...rest }: PublicRouteProps<T> & ConnectedPublicRouteProps) => (
  <Route
    {...(rest as any)}
    render={(props) =>
      authToken ? (
        <Redirect
          to={{
            pathname: Path.DASHBOARD,
            search: props.location.search,
            state: { from: props.location },
          }}
        />
      ) : (
        <Component {...props} {...(rest as any)} />
      )
    }
  />
);

const mapStateToProps = {
  authToken: authTokenSelector,
};

type ConnectedPublicRouteProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(PublicRoute) as {
  <T extends object>(props: PublicRouteProps<T>): React.ReactElement;
};
