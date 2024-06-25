import React from 'react';
import type { RouteComponentProps } from 'react-router-dom';
import { Redirect, Route } from 'react-router-dom';

import { Path } from '@/config/routes';
import { authTokenSelector } from '@/ducks/session';
import { useSelector } from '@/hooks/redux';

export type PublicRouteProps<T extends object> = {
  path: string | string[];
  component: React.ComponentType<T>;
  name?: string;
  exact?: boolean;
} & Omit<T, keyof RouteComponentProps>;

const PublicRoute = <T extends object>({ component: Component, ...rest }: PublicRouteProps<T>) => {
  const authToken = useSelector(authTokenSelector);

  return (
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
};

export default PublicRoute;
