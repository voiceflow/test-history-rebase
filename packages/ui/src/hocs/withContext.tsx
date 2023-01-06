import React from 'react';
import { setDisplayName, wrapDisplayName } from 'recompose';

export const withProvider =
  (Provider: React.ComponentType<React.PropsWithChildren>) =>
  <P, R>(Component: React.ComponentType<P>) =>
    setDisplayName(wrapDisplayName(Component, 'withProvider'))(
      React.forwardRef<R, P>((props, ref) => (
        <Provider>
          <Component {...props} ref={ref} />
        </Provider>
      ))
    );

export const withContext =
  <T, K extends string>(Context: React.Context<T>, key: K) =>
  <P, R>(Component: React.ComponentType<P>) =>
    setDisplayName(wrapDisplayName(Component, 'withContext'))(
      React.forwardRef<R, Omit<P, K>>((props, ref) => {
        const value = React.useContext(Context);

        return <Component {...(props as P)} {...{ [key]: value }} ref={ref} />;
      })
    );

/**
 * Static Contexts give a component access to all the context's API/state
 * manipulation functions without any effect by state
 */
export const withStaticContext =
  <T, K extends string>(Context: React.Context<T>, key: K) =>
  <P, R>(Component: React.ComponentType<P>) =>
    setDisplayName(wrapDisplayName(Component, 'withStaticContext'))(
      React.forwardRef<R, Omit<P, K>>((props, ref) => {
        const value = React.useContext(Context);

        return React.useMemo(() => <Component {...(props as P)} {...{ [key]: value }} ref={ref} />, []);
      })
    );
