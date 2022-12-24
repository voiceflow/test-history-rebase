import React from 'react';
import { Redirect, Route, RouteComponentProps } from 'react-router-dom';

import ErrorBoundary from '@/components/ErrorBoundary';
import { Path } from '@/config/routes';
import { userVerifiedSelector } from '@/ducks/account';
import { authTokenSelector } from '@/ducks/session';
import { PrivateCapabilitiesGate } from '@/gates';
import { connect } from '@/hocs/connect';
import Verify from '@/pages/Auth/Verify';
import { ConnectedProps } from '@/types';

export type PrivateRouteProps<T extends object> = {
  path: string | string[];
  component: React.ComponentType<T>;
  name?: string;
  exact?: boolean;
} & Omit<T, keyof RouteComponentProps>;

const PrivateRoute = <T extends object>({
  component: Component,
  authToken,
  verified,
  ...rest
}: PrivateRouteProps<T> & ConnectedPrivateRouteProps) => (
  <Route
    {...(rest as any)}
    render={(props) => {
      if (!authToken) {
        return (
          <Redirect
            to={{
              pathname: Path.LOGIN,
              search: props.location.search,
              state: { from: props.location },
            }}
          />
        );
      }

      if (!verified) {
        return <Verify />;
      }

      return (
        <PrivateCapabilitiesGate>
          <ErrorBoundary>
            <Component {...props} {...(rest as any)} />
          </ErrorBoundary>
        </PrivateCapabilitiesGate>
      );
    }}
  />
);

const mapStateToProps = {
  authToken: authTokenSelector,
  verified: userVerifiedSelector,
};

type ConnectedPrivateRouteProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(PrivateRoute) as {
  <T extends object>(props: PrivateRouteProps<T>): React.ReactElement;
};
