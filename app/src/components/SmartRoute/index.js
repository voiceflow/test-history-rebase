import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

export default function SmartRoute(props) {
  const { render, exact, children, redirectTo, redirectCondition, ...routeProps } = props;
  const isRenderer = typeof render === 'function';

  return (
    <Route
      {...routeProps}
      exact={exact}
      render={
        isRenderer
          ? options => (redirectCondition ? <Redirect to={redirectTo} /> : render(options))
          : undefined
      }
    >
      {isRenderer
        ? undefined
        : options =>
            ((exact && options.match && options.match.isExact) || !exact) && redirectCondition ? (
              <Redirect to={redirectTo} />
            ) : children ? (
              children(options)
            ) : null}
    </Route>
  );
}

SmartRoute.propTypes = {
  exact: PropTypes.bool,
  render: PropTypes.func,
  children: PropTypes.func,
  redirectTo: PropTypes.string,
  redirectCondition: PropTypes.bool,
};

SmartRoute.defaultProps = {
  exact: false,
};
