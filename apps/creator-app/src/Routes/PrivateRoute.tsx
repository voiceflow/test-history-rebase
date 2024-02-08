import React from 'react';
import { Redirect, Route, RouteComponentProps } from 'react-router-dom';

import ErrorBoundary from '@/components/ErrorBoundary';
import { Path } from '@/config/routes';
import { userVerifiedSelector } from '@/ducks/account';
import { authTokenSelector } from '@/ducks/session';
import { PrivateCapabilitiesGate } from '@/gates';
import { useSelector } from '@/hooks/redux';
import Verify from '@/pages/Auth/Verify';

export type PrivateRouteProps<T extends object> = {
  path: string | string[];
  name?: string;
  exact?: boolean;
  component: React.ComponentType<T>;
  screenSizeWarning?: boolean;
} & Omit<T, keyof RouteComponentProps>;

const PrivateRoute = <T extends object>({ component: Component, screenSizeWarning, ...rest }: PrivateRouteProps<T>) => {
  const authToken = useSelector(authTokenSelector);
  const verified = useSelector(userVerifiedSelector);

  return (
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
          <PrivateCapabilitiesGate screenSizeWarning={screenSizeWarning}>
            <ErrorBoundary>
              <Component {...props} {...(rest as T)} />
            </ErrorBoundary>
          </PrivateCapabilitiesGate>
        );
      }}
    />
  );
};

export default PrivateRoute;
