import { AnyFunction, Utils } from '@voiceflow/common';
import React from 'react';
import { setDisplayName, wrapDisplayName } from 'recompose';

export interface WithHookOptions<T, P extends object> {
  shouldRender?: (props: P) => boolean;
  getProps?: (props: T) => P;
}

export const withHook =
  <C extends AnyFunction, P extends object = ReturnType<C>>(
    useHook: C,
    { getProps = Utils.functional.identity, shouldRender }: WithHookOptions<ReturnType<C>, P> = {},
    ...args: Parameters<typeof useHook>
  ) =>
  <T extends object>(Component: React.FC<T & P>) =>
    setDisplayName(wrapDisplayName(Component, 'withHook'))(
      // eslint-disable-next-line react/display-name
      React.forwardRef<HTMLElement, T>((props, ref) => {
        const value = useHook(...args, props);
        const allProps = { ...getProps(value), ...props, ref };

        if (shouldRender && !shouldRender(allProps)) {
          return null;
        }

        return <Component {...allProps} />;
      })
    );
