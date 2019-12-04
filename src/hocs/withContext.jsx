/* eslint-disable react/display-name */
import React from 'react';
import { setDisplayName, wrapDisplayName } from 'recompose';

export const withProvider = (Provider) => (Component) =>
  setDisplayName(wrapDisplayName(Component, 'withProvider'))(
    React.forwardRef((props, ref) => (
      <Provider>
        <Component {...props} ref={ref} />
      </Provider>
    ))
  );

export const withContext = (Context, key) => (Component) =>
  setDisplayName(wrapDisplayName(Component, 'withContext'))(
    React.forwardRef((props, ref) => {
      const value = React.useContext(Context);

      return <Component {...props} {...{ [key]: value }} ref={ref} />;
    })
  );

/**
 * Static Contexts give a component access to all the context's API/state
 * manipulation functions without any effect by state
 *
 * @param {React.Context} Context
 * @param {string} key
 * @returns {Function}
 */
export const withStaticContext = (Context, key) => (Component) =>
  setDisplayName(wrapDisplayName(Component, 'withStaticContext'))(
    React.forwardRef((props, ref) => {
      const value = React.useContext(Context);

      return React.useMemo(() => <Component {...props} {...{ [key]: value }} ref={ref} />, []);
    })
  );
